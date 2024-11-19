import { token } from "./constant";
import { baseURL } from "./constant";

class Services{

    constructor(){
        this.headers = {
            accpet:"Application/json",
            "Content-Type":"application/json"
        }
    }
    async get(url){
        return fetch(baseURL+url, {
            headers:this.headers,
            method:"GET", 
           
        })
        .then(async (res)=>{
            let resText = await res.text()
            try {
                return JSON.parse(resText);
            } catch (error) {
                return resText;
            }
        })
        .catch((err)=>{
            throw new Error(err);
        })
    }
    async post(url, body){
        let sendData = {...body, token:token}
        return fetch(baseURL+url, {
            headers:this.headers,
            method:"POST",
            body:JSON.stringify(sendData)
        })
        .then(async (res)=>{
            let resText = await res.text()
            try {
                return JSON.parse(resText);
            } catch (error) {
                return resText;
            }
        })
        .catch((err)=>{
            throw new Error(err);
        })
    }
    async postWithoutToken(url, body){
        let sendData = {...body}
        return fetch(baseURL+url, {
            headers:this.headers,
            method:"POST",
            body:JSON.stringify(sendData)
        })
        .then(async (res)=>{
            let resText = await res.text()
            try {
                return JSON.parse(resText);
            } catch (error) {
                return resText;
            }
        })
        .catch((err)=>{
            throw new Error(err);
        })
    }

    async formMethod(url, body){
        // let sendData = {...body, token:token}
        // body.append('token', token);
        return fetch(baseURL+url, {
            headers:this.headers,
            method:"POST",
            body:body
        })
        .then(async (res)=>{
            let resText = await res.text()
            try {
                return JSON.parse(resText);
            } catch (error) {
                return resText;
            }
        })
        .catch((err)=>{
            throw new Error(err);
        })
    }
}

export default Services = new Services();