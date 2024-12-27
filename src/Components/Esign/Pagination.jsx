async downloadReport(e){
  var esignDocument = await connect.fetchesigndocument(e,this.token,this.email)
  const linkSource = `data:application/pdf;base64,${esignDocument[0].esignData}`;
  const downloadLink = document.createElement("a");
  const fileName = `${esignDocument[0].loanId}_Loan_Agreement.pdf`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
},

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

downloadReport is the onclick function of the button Below. I want 