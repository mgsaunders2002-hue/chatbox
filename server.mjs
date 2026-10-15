import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root = new URL('./', import.meta.url);
const instructions = await readFile(new URL('instructions-v1.txt',root),'utf8');
const config={version:'1.0',instructions,hash:createHash('sha256').update(instructions).digest('hex'),model:process.env.OPENAI_MODEL||'gpt-4.1-mini'};
export function validateMessages(messages){
 if(!Array.isArray(messages)||!messages.length||messages.length>60) return false;
 return messages.every(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.trim()&&m.content.length<=12000)&&messages.at(-1).role==='user';
}
export const server=http.createServer(async(req,res)=>{
 const send=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
 try{
 if(req.method==='GET'&&req.url==='/api/config') return send(200,{...config,ready:!!process.env.OPENAI_API_KEY});
 if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'"});return res.end(await readFile(new URL('index.html',root)));}
 if(req.method!=='POST'||req.url!=='/api/chat') return send(404,{error:'Not found'});
 const expected=process.env.APP_ORIGIN || (process.env.CODESPACE_NAME ? `https://${process.env.CODESPACE_NAME}-${Number(process.env.PORT)||3000}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN||'app.github.dev'}` : `http://${req.headers.host}`);
 if(req.headers.origin!==expected) return send(403,{error:'Please use the app from its local address.'});
 if(!process.env.OPENAI_API_KEY) return send(503,{error:'The interface is ready. Add OPENAI_API_KEY to the local .env file to enable conversation.'});
 let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>200000)return send(413,{error:'This conversation is too long. Export it and start a new one.'});}
 let data;try{data=JSON.parse(body);}catch{return send(400,{error:'Invalid request.'});}
 if(!validateMessages(data.messages))return send(400,{error:'Use 1–60 messages, each under 12,000 characters, ending with your thought.'});
 const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:config.model,instructions,input:data.messages,store:false,max_output_tokens:600}),signal:AbortSignal.timeout(60000)});
 if(!response.ok)return send(502,{error:response.status===401?'The API key was not accepted. Check your local settings.':response.status===429?'The API is at its usage or rate limit. Check your account or try again later.':'The model could not respond. Check the model setting and try again.'});
 const result=await response.json();const reply=(result.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n');
 if(!reply)return send(502,{error:'No text was returned. Please try again.'});
 return send(200,{reply,model:result.model||config.model,version:config.version,hash:config.hash});
 }catch{return send(500,{error:'The connection did not complete. Your thought is still here; please try again.'});}
});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Open http://localhost:3000'));
