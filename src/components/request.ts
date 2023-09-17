export async function getJson( url: string ) {
  return fetch(url).then(res=>{ return res.json(); });
} /* End of 'getJson' function */ 

export async function makeReqStr( url: string, query: any ) {
  var queryStr = "";
  Object.keys(query).map((e, i)=>{
    if (query[e] != undefined)
      queryStr += (i != 0 ? '&' : '') + e + '=' + query[e];
  });

  return url + '?' + queryStr;
} /* End of 'makeReqStr' function */