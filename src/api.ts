export type Row=Record<string,any>;
export class ApiError extends Error{constructor(public status:number,message:string){super(message)}}
export const token=()=>sessionStorage.getItem('yeats.teacher.session')||'';
export async function api<T=any>(path:string,method='GET',body?:any):Promise<T>{
 let response:Response;
 try{response=await fetch('/v1/staff'+path,{method,headers:{Authorization:'Bearer '+token(),...(body instanceof FormData?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});}catch{throw new ApiError(0,'暂时无法连接服务；已保留输入，请恢复后重试')}
 const result=await response.json().catch(()=>({}));
 if(!response.ok){if(response.status===401){sessionStorage.removeItem('yeats.teacher.session');window.dispatchEvent(new Event('yeats-expired'))}throw new ApiError(response.status,response.status>=500?'服务器暂时异常，请稍后重试':typeof result.detail==='string'?result.detail:'请求未完成，请检查填写内容')}
 return result;
}
export const key=()=>crypto.randomUUID();
export const date=(v:string)=>v?new Date(v).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false}):'—';
export const status:Row={todo:'未提交',submitted:'待批改',returned:'退回重做',graded:'已批改',present:'已签到',makeup:'补签',absent:'缺勤',leave:'请假',pending:'待平台审核',approved:'已通过',rejected:'已驳回',entry:'入门测',exit:'出门测',scheduled:'待上课',completed:'已完成'};

export async function download(path:string,filename:string){
 const response=await fetch('/v1/staff'+path,{headers:{Authorization:'Bearer '+token()}});
 if(!response.ok){if(response.status===401){sessionStorage.removeItem('yeats.teacher.session');window.dispatchEvent(new Event('yeats-expired'))}const error=await response.json().catch(()=>({}));throw Error(error.detail||'导出失败，请重试')}
 const url=URL.createObjectURL(await response.blob()),anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function mediaUrl(value:string){const u=new URL(value,location.href);return ['127.0.0.1','localhost'].includes(location.hostname)&&['127.0.0.1','localhost'].includes(u.hostname)&&u.pathname.startsWith('/v1/media/')?u.pathname+u.search:value}
