function formToObject(form){
  const data = {};
  const fd = new FormData(form);
  for(const [k,v] of fd.entries()){
    // checkboxes: value "on" if checked
    data[k] = v;
  }
  // boolean checkboxes
  data.HAS_VACCINES = form.querySelector('input[name="HAS_VACCINES"]').checked;
  data.FULL_ACCESS = form.querySelector('input[name="FULL_ACCESS"]').checked;
  return data;
}

function saveForm(form){
  const obj = formToObject(form);
  localStorage.setItem("practiceData", JSON.stringify(obj));
  alert("Saved.");
}

function loadForm(form){
  const raw = localStorage.getItem("practiceData");
  if(!raw) return;
  const obj = JSON.parse(raw);
  for(const el of form.elements){
    if(!el.name) continue;
    if(el.type === "checkbox"){
      el.checked = !!obj[el.name];
    } else if(obj[el.name] !== undefined){
      el.value = obj[el.name];
    }
  }
}

function setLang(lang){
  localStorage.setItem("lang", lang);
  document.getElementById("langStatus").textContent = "Selected language: " + (lang==="en" ? "English" : "Afrikaans");
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  loadForm(form);

  document.getElementById("btnEn").addEventListener("click", ()=>setLang("en"));
  document.getElementById("btnAf").addEventListener("click", ()=>setLang("af"));

  // show current lang
  setLang(localStorage.getItem("lang") || "en");

  document.getElementById("saveBtn").addEventListener("click", ()=>saveForm(form));
  document.getElementById("downloadBtn").addEventListener("click", async ()=>{
    const obj = formToObject(form);
    localStorage.setItem("practiceData", JSON.stringify(obj));
    try{
      await downloadZip(obj);
    } catch(e){
      console.error(e);
      alert("Could not generate ZIP: " + e.message);
    }
  });
});
