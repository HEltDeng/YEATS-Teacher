import {defineConfig} from 'vite';export default defineConfig({base:'/teacher/',server:{proxy:{'/v1':'http://127.0.0.1:8930','/health':'http://127.0.0.1:8930'}}});
