function getAccessLevel(formData){
  // Demo vs Full (temporary)
  return formData.FULL_ACCESS ? "full" : "demo";
}

function isColdChainIncluded(formData){
  return !!formData.HAS_VACCINES;
}
