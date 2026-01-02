async function fetchText(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error("Failed to load: " + path);
  return await res.text();
}

async function buildZip(formData){
  const lang = localStorage.getItem("lang") || "en";
  const access = getAccessLevel(formData);

  const zip = new JSZip();
  const sopsFolder = zip.folder("SOPs");
  const regsFolder = zip.folder("Registers");
  const docsFolder = zip.folder("Docs");
  const auditFolder = zip.folder("Audit");

  // Set governance placeholders
  const now = new Date();
  const dateGenerated = now.toISOString().slice(0,10);
  const nextReview = new Date(now.getFullYear(), now.getMonth()+12, now.getDate()).toISOString().slice(0,10);

  const data = {
    ...formData,
    DATE_GENERATED: dateGenerated,
    NEXT_REVIEW_DATE: nextReview,
    VERSION: "1.0",
  };

  const sopBase = `../templates/${lang}/`;
  const regBase = `../registers/${lang}/`;

  // Demo vs Full file lists
  const sopFilesDemo = (lang==="en") ? ["SOP_01_IPC.md"] : ["SOP_01_IVB.md"];
  const regFilesDemo = (lang==="en") ? ["REG_01_CLEANING_LOG.csv"] : ["REG_01_SKOONMAAK_LOG.csv"];

  // Full lists (filenames present in repo)
  const sopFilesFull = (lang==="en") ? [
    "SOP_01_IPC.md","SOP_02_CLEANING.md","SOP_03_HAND_HYGIENE.md","SOP_04_PPE.md",
    "SOP_05_WASTE.md","SOP_06_SHARPS.md","SOP_07_EXPOSURE.md","SOP_08_RECORDS.md",
    "SOP_09_INCIDENTS.md","SOP_10_COMPLAINTS.md","SOP_11_EMERGENCY.md","SOP_12_COLD_CHAIN.md"
  ] : [
    "SOP_01_IVB.md","SOP_02_SKOONMAAK.md","SOP_03_HANDHIGIENE.md","SOP_04_PBT.md",
    "SOP_05_GESONDHEIDSAFVAL.md","SOP_06_SKERP.md","SOP_07_NAALDSTEEK.md","SOP_08_REKORDS.md",
    "SOP_09_VOORVALLE.md","SOP_10_KLAGTES.md","SOP_11_NOOD.md","SOP_12_KOELKETTING.md"
  ];

  const regFilesFull = (lang==="en") ? [
    "REG_01_CLEANING_LOG.csv","REG_02_WASTE_LOG.csv","REG_03_SHARPS_LOG.csv","REG_04_FRIDGE_TEMP.csv",
    "REG_05_EQUIPMENT_CHECK.csv","REG_06_TRAINING_REGISTER.csv","REG_07_INCIDENT_REGISTER.csv",
    "REG_08_COMPLAINTS_REGISTER.csv","REG_09_FIRE_EXTINGUISHER.csv","REG_10_MAINTENANCE_LOG.csv"
  ] : [
    "REG_01_SKOONMAAK_LOG.csv","REG_02_AFVAL_LOG.csv","REG_03_SKERP_LOG.csv","REG_04_KOELKAS_TEMP.csv",
    "REG_05_TOERUSTING_KONTROLE.csv","REG_06_OPLEIDING_REGISTER.csv","REG_07_VOORVAL_REGISTER.csv",
    "REG_08_KLAGTES_REGISTER.csv","REG_09_BRANDBLUSSER.csv","REG_10_INSTANDHOUDING.csv"
  ];

  const sopFiles = (access==="full") ? sopFilesFull : sopFilesDemo;
  const regFiles = (access==="full") ? regFilesFull : regFilesDemo;

  // SOPs
  for(const file of sopFiles){
    if(!isColdChainIncluded(formData) && (file.includes("COLD") || file.includes("KOEL"))){
      continue;
    }
    const txt = await fetchText(sopBase + file);
    sopsFolder.file(file, fillTemplate(txt, data));
  }

  // Registers
  for(const file of regFiles){
    if(!isColdChainIncluded(formData) && (file.includes("FRIDGE") || file.includes("KOELKAS"))){
      continue;
    }
    const txt = await fetchText(regBase + file);
    regsFolder.file(file, txt); // CSV headers don't need placeholder fill
  }

  // Docs & audit (language-based)
  if(lang==="en"){
    docsFolder.file("OHSC_Evidence_Map.md", fillTemplate(await fetchText("../docs/OHSC_Evidence_Map.md"), data));
    docsFolder.file("OHSC_Cover_Letter.md", fillTemplate(await fetchText("../docs/OHSC_Cover_Letter_EN.md"), data));
    if(access==="full"){
      auditFolder.file("OHSC_Annual_Self_Audit.md", fillTemplate(await fetchText("../audit/OHSC_Annual_Self_Audit_EN.md"), data));
    }
  } else {
    docsFolder.file("OHSC_Evidence_Map.md", fillTemplate(await fetchText("../docs/OHSC_Evidence_Map.md"), data));
    docsFolder.file("OHSC_Dekbrief.md", fillTemplate(await fetchText("../docs/OHSC_Dekbrief_AF.md"), data));
    if(access==="full"){
      auditFolder.file("OHSC_Jaarlikse_Selfoudit.md", fillTemplate(await fetchText("../audit/OHSC_Jaarlikse_Selfoudit_AF.md"), data));
    }
  }

  return zip;
}

async function downloadZip(formData){
  const zip = await buildZip(formData);
  const blob = await zip.generateAsync({type:"blob"});
  saveAs(blob, "OHSC_Compliance_Pack.zip");
}
