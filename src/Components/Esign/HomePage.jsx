import React, { useState, useEffect } from "react";
// import connect from "../../connect/HomeConnect";
import connect from "../../connect/HC2";
import * as XLSX from "xlsx";
import "./HomePage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../../App";

const HomePage = () => {
  const [nbfc, setNbfc] = useState("");
  const [loanId, setLoanId] = useState("");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [mobile1, setMobile1] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productData, setProductData] = useState([]);
  const [adobeData, setAdobeData] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  const [signPartner, setSignPartner] = useState("");
  const [file, setFile] = useState(null);

  const [templateDropdown, setTemplatedropdown] = useState([]);
  useEffect(() => {

    const userToken = localStorage.getItem("TOKEN");
    const userEmail = localStorage.getItem("EMAIL");
    setToken(userToken);
    setEmail(userEmail);

    // Fetch Product Data
    axios.post(url + "/api/fetch/documents/data", {
      token: userToken,
      email: userEmail,
    })
      .then((res) => {
        console.log(res.data);
        setProductData(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });

    // Fetch Adobe Data
    axios
      .post(url + "/api/fetch/adobe/data", {
        token: userToken,
        email: userEmail,
      })
      .then((res) => {
        console.log(res)
        setAdobeData(res?.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });

    axios
      .post(url + "/template/getproductname", {
        token: userToken,
        email: userEmail,
      })
      .then((res) => {
        console.log(res.data);
        setTemplatedropdown(res?.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [token, email]);

  useEffect(() => {
    if (!selectedProductId) return;

    const fetchData = async () => {
      try {
        const res = await axios.post(url + "/template/get", {
          token,
          email,
          ProductId: selectedProductId,
        });
        const data = res.data?.[0] || {};
        
        setSignPartner(data.signPartner || "");
        console.log(signPartner)
        
        
      } catch (err) {
        toast.error(err.message);
      }   
    };
    fetchData();
  }, [selectedProductId, token, email]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const deletePdf = async (loanId) => {
    axios
      .post(url + "/api/adobe/delete", {
        loanId: loanId,
        token: token,
        email: email,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  

  const handlePreviewPdf = async (adobeLocation) => {
    try {
      const response = await axios.post(url + "/api/fetch/adobe/pdf", {
        adobeLocation,
        token,
        email,
      });
      const data = response.data.map((adobe) => ({
        url: adobe.url,
      }));

      // Open the first URL in a new tab
      if (data.length > 0) {
        window.open(data[0].url, "_blank");
      } else {
        console.error("No URLs found in the response.");
      }
    } catch (error) {
      console.error("Error fetching and previewing Adobe PDF:", error);
    }
  };

  function downloadJSON(sampleData) {
    // Check if selectedProductId is truthy
    if (!selectedProductId) {
      alert("Please select a valid Template ID before downloading the JSON file.");
      return;
    }

    // Check if sampleData is defined
    if (sampleData !== undefined) {
      let sampleJson = { fields: [] };

      // Populate the `fields` array starting from index 9
      for (let i = 9; i < Object.keys(sampleData).length; i++) {
        let sampleJsonOne = {
          name: sampleData[i],
          value: "",
        };
        sampleJson.fields.push(sampleJsonOne);
      }

      sampleJson = JSON.stringify(sampleJson);

      // Create and trigger file download
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(sampleJson));
      element.setAttribute("download", "Sample.txt");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      alert("Sample data is unavailable.");
    }
  }

  const downloadSampleFile = () => {
    let sampleData;
    if (selectedProductId) {

      if (signPartner === 'Digio') {
        sampleData = ['Template_Id', 'Loan_Id', 'Loan_Amount', 'Borrower1_Mobile', 'Borrower1_Name', 'Borrower2_Mobile', 'Borrower2_Name', 'Borrower3_Mobile', 'Borrower3_Name'];
      } else {
        sampleData = ['Template_Id', 'Loan_Id', 'Borrower1_Mobile', 'Borrower1_Name', 'Borrower1_SignType', 'Borrower2_Mobile', 'Borrower2_Name', 'Borrower2_SignType', 'Borrower3_Mobile', 'Borrower3_Name', 'Borrower3_SignType'];
      }
      const worksheet = XLSX.utils.json_to_sheet([{ ...sampleData }]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
      XLSX.writeFile(workbook, "Sample.xlsx");
    } else {
      alert("Please Select Template ID");
    }
  };

  const handleTemplateChange = async (event) => {
    console.log(event.target.value);

    setSelectedProductId(event.target.value);
  };

  function uploadFile() {

  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const sendToDigio = async (loanId) => {
    if (!file) {
      alert("First upload the file");
      return;
    }

    if (file.name !== `${loanId}.pdf`) {
      alert("File name must be equal to the loan id.");
      return;
    }

    const base64 = await getBase64(file);
    if (base64) {
      await handleFileUpload(base64, loanId);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const result = reader.result.replace("data:application/pdf;base64,", "");
        resolve(result);
      };

      reader.onerror = (error) => {
        console.error(error);
        reject(null);
      };
    });
  };

  const handleFileUpload = async (base64, loanId) => {
    let name1 = "";
    let name2 = "";
    let name3 = "";
    let mobile1 = "";
    let mobile2 = "";
    let mobile3 = "";
    let loanAmount = "";
    let templateId = "";

    adobeData.forEach((value) => {
      if (value.LoanId === loanId) {
        name1 = value.Signer1;
        name2 = value.Signer2;
        name3 = value.Signer3;
        mobile1 = value.Mobile1;
        mobile2 = value.Mobile2;
        mobile3 = value.Mobile3;
        loanAmount = value.loanAmount;
        templateId = value.ProductId;
      }
    });

    try {
      const templateData = await getLoanAgreement(templateId, token, email);
      const clientBase = btoa(`${templateData[0].clientId}:${templateData[0].clientSecret}`);

      const data = await esignSend(
        loanId,
        name1,
        name2,
        name3,
        mobile1,
        mobile2,
        mobile3,
        "", // signType1
        "", // signType2
        "", // signType3
        clientBase,
        templateData[0].stampDutyMethod,
        templateData[0].stampDutyValue,
        templateData[0].dscName,
        templateData[0].dscContact,
        templateData[0].stampName,
        loanAmount,
        base64,
        templateData[0].signPartner,
        "", // partnerTemplateId
        token,
        email
      );

      handleResponse(data, templateData[0].signPartner);
    } catch (error) {
      console.error(error);
    }
  };

  const getLoanAgreement = (productId, token, email) => {
    return axios
      .post("urlthree", { ProductId: productId, token, email })
      .then((res) =>
        res.data.map((score) => ({
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
          stampSeries: score.stampSeries,
          dynamicFields: score.dynamicFields,
          dynamicFieldsLeegality: score.dynamicFieldsLeegality,
          signPartner: score.signPartner,
        }))
      )
      .catch((err) => {
        throw err;
      });
  };

  const esignSend = (
    loanId,
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
    dscName,
    dscMobile,
    stampName,
    loanAmount,
    base64,
    signPartner,
    partnerTemplateId,
    token,
    email
  ) => {
    return axios
      .post("url", {
        Loanid: loanId,
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
        DSC_Name: dscName,
        DSC_Mobile: dscMobile,
        stampName,
        loanAmount,
        base64,
        signPartner,
        partnerTemplateId,
        token,
        email,
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  };

  const handleResponse = (data, signPartner) => {
    if (signPartner === "Leegality") {
      if (data.status === 1) {
        alert(data.data.documentId);
        window.location.reload();
      } else if (data.status === 0) {
        alert(data.messages[0].message);
      } else {
        alert(`${data.message} Please check the respective API key`);
      }
    } else if (signPartner === "Digio") {
      if (data.id !== undefined) {
        alert(data.id);
        window.location.reload();
      } else {
        alert(data.message);
      }
    }
  }

return (
  <div className="container">
    <div className="sidebar">
      <div>
        <p style={{ color: "lightcoral", fontWeight:"100" }}>Home Page</p>
      </div>

      <div className="sidebar-actions">
        <button onClick={() => (window.location.href = "/addtemplate")} className="btn-primary">
          Add Template
        </button>
        <button onClick={() => (window.location.href = "/uploadpdf")} className="btn-primary">
          Upload
        </button>
        <button onClick={() => (window.location.href = "/documents")} className="btn-primary">
          Documents
        </button>
        <button onClick={logout} className="btn-primary">
          Logout
        </button>
      </div>

      <div className="template-selector">
        <p>Select Template ID</p>
        <select
          onChange={handleTemplateChange}
          value={selectedProductId}
          className="dropdown"
        >
          <option value="">--Select--</option>
          {templateDropdown?.map((product) => (
            <option key={product._id} value={product.Productid}>
              {product.Productid}
            </option>
          ))}
        </select>
      </div>

      <h1>JSON Format</h1>
      <div className="json-section">
        <button onClick={downloadJSON} className="btn-primary">
          Sample Fields
        </button>
        <p style={{ color: "lightcoral" }}>
          Please download JSON only for Digio
        </p>
      </div>

      <h1>Bulk Upload</h1>
      <div className="bulk-upload-section">
        <button onClick={downloadSampleFile} className="btn-primary">
          Sample File
        </button>
        <button onClick={uploadFile} className="btn-primary">
          Upload File
        </button>
      </div>

      <h1>Generated Documents</h1>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Loan Id</th>
            <th>Case Status</th>
            <th>Preview</th>
            <th>Upload</th>
            <th>Send</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {adobeData?.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.LoanId}</td>
              <td>{doc.caseStatus}</td>
              <td>
                <button className="btn-secondary" onClick={() => handlePreviewPdf(doc.adobeLocation)}>
                  Preview
                </button>
              </td>
              <td>
                <label
                  htmlFor="sendPdfAdobe"
                  style={{ margin: "auto" }}
                  id="upload-style"
                  className="btn-secondary"
                >
                  Upload
                </label>
                <input
                  id="sendPdfAdobe"
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleFileChange}
                />
              </td>
              <td>
                <button className="btn-secondary">Send</button>
              </td>
              <td>
                <button onClick={() => deletePdf(doc.LoanId)} className="btn-secondary">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Templates</h1>
      <table className="templates-table">
        <thead>
          <tr>
            <th>Template ID</th>
            <th>NBFC Name</th>
          </tr>
        </thead>
        <tbody>
          {templateDropdown?.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.Productid}</td>
              <td>{doc.nbfcName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

  };

export default HomePage;
