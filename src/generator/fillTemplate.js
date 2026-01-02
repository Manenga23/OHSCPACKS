function fillTemplate(text, data){
  return text.replace(/{{(.*?)}}/g, function(_, key){
    const k = String(key).trim();
    return (data[k] !== undefined && data[k] !== null) ? String(data[k]) : "";
  });
}
