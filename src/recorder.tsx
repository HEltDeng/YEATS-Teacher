import React,{useState,useRef,useEffect}from'react';
import{api,Row}from'./api';
export function Recorder({onSave}:{onSave:(file:Row)=>void}){
 const[recording,setRecording]=useState(false),[busy,setBusy]=useState(false),[seconds,setSeconds]=useState(0),[error,setError]=useState('');
 const recorder=useRef<MediaRecorder|null>(null),callback=useRef(onSave),mounted=useRef(true);callback.current=onSave;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;const r=recorder.current;if(r&&r.state!=='inactive')r.stop();r?.stream.getTracks().forEach(t=>t.stop())}},[]);
 useEffect(()=>{if(!recording)return;const timer=setInterval(()=>setSeconds(v=>v+1),1000);return()=>clearInterval(timer)},[recording]);
 async function start(){setError('');setBusy(true);try{
   if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('当前浏览器不支持录音，请上传 MP3/WAV 文件');
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   if(!mounted.current){stream.getTracks().forEach(t=>t.stop());return}
   const mime=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
   if(!mime){stream.getTracks().forEach(t=>t.stop());throw Error('当前录音格式不受支持，请上传 MP3/WAV 文件')}
   const r=new MediaRecorder(stream,{mimeType:mime}),parts:Blob[]=[];recorder.current=r;
   r.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};
   r.onerror=()=>{setError('录音中断，请重试或上传音频文件');r.stream.getTracks().forEach(t=>t.stop());setRecording(false);setBusy(false)};
   r.onstop=async()=>{r.stream.getTracks().forEach(t=>t.stop());if(!mounted.current)return;setRecording(false);setBusy(true);try{const b=new Blob(parts,{type:mime});if(!b.size)throw Error('录音为空');const form=new FormData();form.append('file',b,mime.includes('ogg')?'老师录音.ogg':'老师录音.webm');callback.current(await api('/files','POST',form));}catch(e:any){setError(e.message)}finally{if(mounted.current)setBusy(false)}};
   r.start(1000);setSeconds(0);setRecording(true);
 }catch(e:any){setError(e.name==='NotAllowedError'?'未获麦克风授权；可以改为上传音频文件':e.message)}finally{setBusy(false)}}
 return <div className="toolbar">{recording?<><span role="status">录音中 · {seconds} 秒</span><button type="button" onClick={()=>{setBusy(true);recorder.current?.stop()}}>停止并保存录音</button></>:<button type="button" disabled={busy} onClick={start}>{busy?'音频处理中…':'使用麦克风录音'}</button>}<small>浏览器会请求麦克风权限，录音保存后仍需提交当前业务表单。</small>{error&&<div className="error" role="alert">{error}</div>}</div>
}
