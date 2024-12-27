import axios from 'axios';

const urlMain = 'http://localhost:5000'
// const urlMain = 'http://staging.console.api.credin.in'
// const urlMain = 'https://consoleapi.credin.in'

const url = `${urlMain}/api/digio`;
const urlone = `${urlMain}/template/insert`;
const urltwo = `${urlMain}/template/getproductname`;
const urlthree = `${urlMain}/template/get`;
const urlfour = `${urlMain}/template/delete`;
//const urlfive = `${urlMain}/api/fetch`;
const urlsix = `${urlMain}/api/auth/login`
const urlseven = `${urlMain}/api/auth/register`
const urleight = `${urlMain}/api/fetch/document`
const urlnine = `${urlMain}/api/fetch/documents/data`
const urlten = `${urlMain}/api/fetch/documents/file`
const urleleven = `${urlMain}/api/fetch/documents/status`
const urltwelve = `${urlMain}/api/fetch/status`
const urlthirteen = `${urlMain}/api/fetch/documents/preview`
const urlfourteen = `${urlMain}/template/upload/agreement`
const urlfifteen = `${urlMain}/api/adobe/pdf`
const urlsixteen = `${urlMain}/api/fetch/adobe/data`
const urlseventeen = `${urlMain}/api/fetch/adobe/pdf`
const urleighteen = `${urlMain}/api/adobe/delete`

class connect{
    static esignsend(Loanid,name1,name2,name3,mobile1,mobile2,mobile3,signType1,signType2,signType3,clientBase,stampDutyMethod,stampDutyValue,DSC_Name,DSC_Mobile,stampName,loanAmount,base64,signPartner,partnerTemplateId,token,email){
        return new Promise ((reject) => {
            axios.post(url,{
                Loanid,
                name1,
                name2,
                name3,
                mobile1,
                mobile2,
                mobile3,
                signType1,
                signType2,
                signType3,
                clientBase,
                stampDutyMethod,
                stampDutyValue,
                DSC_Name,
                DSC_Mobile,
                stampName,
                loanAmount,
                base64,
                signPartner,
                partnerTemplateId,
                token,
                email
            }).then((res) => {
                const data = res.data;
                if(signPartner == 'Leegality'){
                    console.log(data.status)
                    if(data.status == 1){
                        alert(data.data.documentId)
                        location.reload()
                    }else if(data.status == 0){
                        alert(data.messages[0].message)
                    }else{
                        alert(data.message + 'Please check respective API key')
                    }
                }else if(signPartner == 'Digio'){
                    console.log(data.id)
                    if(data.id != undefined){
                        alert(data.id)
                        location.reload()
                    }else{
                        alert(data.message)
                    }
                }
            }).catch((err)=> {
                reject(err);
            })   
        });
    }

    static loanagreementinsert(ProductID,ProductName,Loanagreement,nbfcName,stampDutyMethod,stampDutyValue,clientId,clientSecret,apiKey,dscName,dscContact,stampName,stampSeries,dynamicFields,dynamicFieldsLeegality,signPartner,token,email){
        return new Promise ((reject) => {
            axios.post(urlone,{
                ProductID,
                ProductName,
                Loanagreement,
                nbfcName,
                stampDutyMethod,
                stampDutyValue,
                clientId,
                clientSecret,
                apiKey,
                dscName,
                dscContact,
                stampName,
                stampSeries,
                dynamicFields,
                dynamicFieldsLeegality,
                signPartner,
                token,
                email
            }).catch((err)=> {
                reject(err);
            })   
        });
    }

    static getproductid(token,email){
        return new Promise ((resolve,reject) => {
            axios.post(urltwo,{
                token,
                email
            }).then((res) => {
                const data = res.data;
                resolve(
                    data.map( score => ({
                        Productid: score.Productid,
                        Productname: score.Productname,
                        stampDutyMethod: score.stampDutyMethod,
                        stampDutyValue: score.stampDutyValue,
                        nbfcName: score.nbfcName
                    }))
                );
            })
            .catch((err)=> {
                reject(err);
            })   
        });
    }

    static getloanagreement(ProductId,token,email){
        return new Promise ((resolve,reject) => {
            axios.post(urlthree,{
                ProductId,
                token,
                email
            }).then((res) => {
                const data = res.data;
                resolve(
                    data.map( score => ({
                        Productid: score.Productid,
                        Productname: score.Productname,
                        nbfcName: score.nbfcName,
                        Loanagreement: score.Loanagreement,
                        clientId: score.clientId,
                        clientSecret: score.clientSecret,
                        apiKey: score.apiKey,
                        stampDutyMethod: score.stampDutyMethod,
                        stampDutyValue: score.stampDutyValue,
                        dscName: score.dscName,
                        dscContact: score.dscContact,
                        stampName: score.stampName,
                        stampSeries : score.stampSeries,
                        dynamicFields: score.dynamicFields,
                        dynamicFieldsLeegality: score.dynamicFieldsLeegality,
                        signPartner: score.signPartner
                    }))
                );
            })
            .catch((err)=> {
                reject(err);
            })   
        });
    }

    static loanagreementdelete(ProductID,token,email){
        return new Promise ((reject) => {
            axios.post(urlfour,{
                ProductID,
                token,
                email
            }).catch((err)=> {
                reject(err);
            })   
        });
    }

    static insertlogindata(email,password){
        return new Promise ((reject) => {
            axios.post(urlseven,{
                email,
                password
            }).catch((err)=> {
                reject(err);
            })   
        });
    }

    static getlogindata(email,password){
        return new Promise ((resolve,reject) => {
            axios.post(urlsix,{
                email,
                password
            }).then((res) => {
                const data = [res.data];
                resolve(
                    data.map( login => ({
                        auth: login.auth,
                        token: login.token,
                        email: login.email
                    }))
                );
            })
            .catch((err)=> {
                reject(err);
            })   
        });
    }

    static fetchdocument(loanId){
        return new Promise ((resolve,reject) => {
            axios.post(urleight,{
                loanId
            }).then((res) => {
                const data = [res.data];
                resolve(
                    data.map( login => ({
                        pdfData: login.pdfData
                    }))
                );
            })
            .catch((err)=> {
                reject(err);
            })   
        });
    }

    // static loandatfetch(){
    //     return new Promise ((reject) => {
    //         axios.post(urlfive).then((res) => {
    //             const data = res.data;
    //         }).catch((err)=> {
    //             reject(err);
    //         })   
    //     });
    // }

    static fetchdata(token,email){
        return new Promise ((resolve,reject)=>{
            axios.post(urlnine,{
                token,
                email
            }).then((res)=>{
                const data = res.data;
                resolve(
                    data.map(esign => ({
                        loanId: esign.loanId,
                        esignDate: esign.esignDate
                    }))
                )
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    static fetchesigndocument(loanId,token,email){
        return new Promise ((resolve,reject)=>{
            axios.post(urlten,{
                loanId,
                token,
                email
            }).then((res)=>{
                const data = [res.data];
                resolve(
                    data.map(esign => ({
                        loanId: esign.loanId,
                        esignData: esign.esignData,
                        auditTrail: esign.auditTrail
                    }))
                )
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    static fetchdatastatus(token,email){
        return new Promise ((resolve,reject)=>{
            axios.post(urleleven,{
                token,
                email
            }).then((res)=>{
                const data = res.data;
                resolve(
                    data.map(esign => ({
                        Loanid: esign.Loanid,
                        digioid: esign.digioid,
                        Mobile1: esign.Mobile1,
                        Mobile2: esign.Mobile2,
                        Mobile3: esign.Mobile3,
                        Signer1: esign.Signer1,
                        Signer2: esign.Signer2,
                        Signer3: esign.Signer3,
                        Signer1status: esign.Signer1status,
                        Signer2status: esign.Signer2status,
                        Signer3status: esign.Signer3status,
                        esignData: esign.esignData,
                        url1: esign.url1,
                        url2: esign.url2,
                        url3: esign.url3,
                    }))
                )
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    static fetchstatus(documentId,loanId,token,email){
        return new Promise ((resolve,reject)=>{
            axios.post(urltwelve,{
                documentId,
                loanId,
                token,
                email
            }).then((res)=>{
                const data = [res.data];
                resolve(
                    data.map(esign => ({
                        Loanid: esign.Loanid,
                        digioid: esign.digioid,
                        Mobile1: esign.Mobile1,
                        Mobile2: esign.Mobile2,
                        Mobile3: esign.Mobile3,
                        Signer1: esign.Signer1,
                        Signer2: esign.Signer2,
                        Signer3: esign.Signer3,
                        Signer1status: esign.Signer1status,
                        Signer2status: esign.Signer2status,
                        Signer3status: esign.Signer3status,
                        esignData: esign.esignData,
                    }))
                )
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    static fetchpreview(loanId,digioId,token,email){
        return new Promise ((resolve,reject)=>{
            axios.post(urlthirteen,{
                loanId,
                digioId,
                token,
                email
            }).then((res)=>{
                const data = [res.data];
                console.log(res.data)
                resolve(
                    data.map(esign => ({
                        Loanid: esign.Loanid,
                        esignData: esign.esignData
                    }))
                )
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    static uploadagreement(uniqueIdMain,encodedString,token,email){
        return new Promise ((reject)=>{
            axios.post(urlfourteen,{
                uniqueIdMain,
                encodedString,
                token,
                email
            }).then((res)=>{
                const data = res.data;
                console.log(data)
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        })
    }

    static adobedocumentsend(loanId,loanAmount,productId,base64Response,jsonDataForMerge,Signer1,Signer2,Signer3,DSC_sign,Mobile1,Mobile2,Mobile3,DSC_Mobile,signPartner,token,email){
        return new Promise ((reject)=>{
            axios.post(urlfifteen,{
                loanId,
                loanAmount,
                productId,
                base64Response,
                jsonDataForMerge,
                Signer1,
                Signer2,
                Signer3,
                DSC_sign,
                Mobile1,
                Mobile2,
                Mobile3,
                DSC_Mobile,
                signPartner,
                token,
                email
            }).then((res)=>{
                const data = res.data;
                if(res.data.msg == 201){
                    alert('Document Generation in Progress')
                    location.reload()
                }else{
                    alert('Document Generation is Failed')
                }
                console.log(data)
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        })
    }

    static fetchadobedata(token,email){
        return new Promise((resolve,reject)=>{
            axios.post(urlsixteen,{
                token,
                email
            }).then((res)=>{
                const data = res.data;
                resolve(
                    data.map(adobe => ({
                        LoanId: adobe.LoanId,
                        caseStatus: adobe.caseStatus,
                        adobeLocation: adobe.adobeLocation,
                        ProductId: adobe.ProductId,
                        loanAmount: adobe.loanAmount,
                        adobeAssetId: adobe.adobeAssetId,
                        adobeRequestId: adobe.adobeRequestId,
                        Signer1: adobe.Signer1,
                        Signer2: adobe.Signer2,
                        Signer3: adobe.Signer3,
                        DSC_sign: adobe.DSC_sign,
                        Mobile1: adobe.Mobile1,
                        Mobile2: adobe.Mobile2,
                        Mobile3: adobe.Mobile3,
                        DSC_Mobile: adobe.DSC_Mobile,
                    }))
                )
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        })
    }

    static fetchadobepdf(adobeLocation,token,email){
        return new Promise((resolve,reject)=>{
            axios.post(urlseventeen,{
                adobeLocation,
                token,
                email
            }).then((res)=>{
                const data = [res.data];
                console.log(data)
                resolve(
                    data.map(adobe=>({
                        url: adobe.url
                    }))
                )
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        })
    }

    static adobedelete(loanId,token,email){
        return new Promise((reject)=>{
            axios.post(urleighteen,{
                loanId,
                token,
                email
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        })
    }
}

export default connect;


