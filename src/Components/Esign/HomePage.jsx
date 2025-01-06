import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./HomePage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../../App";

const HomePage = () => {
  const [nbfc, setNbfc] = useState("");
  const [loanId, setLoanId] = useState("");
  const [Signer1, setSigner1] = useState("");
  const [Signer2, setSigner2] = useState("");
  const [Signer3, setSigner3] = useState("");
  
  const [Mobile1, setMobile1] = useState("");
  const [Mobile2, setMobile2] = useState("");
  const [Mobile3, setMobile3] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productData, setProductData] = useState([]);
  const [adobeData, setAdobeData] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [clientBase, setclientBase] = useState("")
  const [clientId, setclientId] = useState("")
  const [clientSecret, setclientSecret] = useState("")
  const [stampDutyMethod, setstampDutyMethod] = useState("")
  const [stampDutyValue, setstampDutyValue] = useState("")
  const [DSC_Name, setDSC_Name] = useState("")
  const [DSC_Mobile, setDSC_Mobile] = useState("")
  const [stampName, setstampName] = useState("")
  const [loanAmount, setloanAmount] = useState("")
  const [signPartner, setSignPartner] = useState("");
  const [file, setFile] = useState(null);

  const [templateDropdown, setTemplatedropdown] = useState([]);
  let [dynamicFields, setDynamicFields] = useState([]);
  const [dynamicFieldsLeegalityFields, setDynamicFieldsLeegalityFields] = useState([]);
  const [base64, setBase64] = useState('');

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
        console.log(res?.data)
        setAdobeData(res?.data);
        console.log(res?.data[0]?.Signer1);
        setSigner1(res?.data[0]?.Signer1);
        setSigner2(res?.data[0]?.Signer2);
        setSigner3(res?.data[0]?.Signer3);
        setMobile1(res?.data[0]?.Mobile1);
        setMobile2(res?.data[0]?.Mobile2);
        setMobile3(res?.data[0]?.Mobile3);
        setloanAmount(res?.data[0]?.loanAmount)
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
        console.log(res.data?.[0])
        console.log(data?.clientId)
        setSignPartner(data.signPartner || "");
        setDynamicFields(data.dynamicFields)
        setDynamicFieldsLeegalityFields(data.dynamicFieldsLeegality.fields)
        console.log(signPartner)
        console.log(data.dynamicFieldsLeegality.fields)



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
      const pdfUrl = response.data.url;


      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      } else {
        console.error("No URL found in the response.");
      }
    } catch (error) {
      if (error.response) {
        console.error("API responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received from the API:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  function downloadJSON() {
    // Check if selectedProductId is truthy
    if (!selectedProductId) {
      alert("Please select a valid Template ID before downloading the JSON file.");
      return;
    }

    // Check if sampleData is defined
    if (dynamicFields !== undefined) {
      let sampleJson = { fields: [] };
      console.log(dynamicFields)
      // Populate the `fields` array starting from index 9
      for (let i = 9; i < Object.keys(dynamicFields).length; i++) {
        let sampleJsonOne = {
          name: dynamicFields[i],
          value: "",
        };
        sampleJson.fields.push(sampleJsonOne);
      }
      console.log(dynamicFields)

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

    if (selectedProductId) {

      if (signPartner === 'Digio') {

        dynamicFields = ['Template_Id', 'Loan_Id', 'Loan_Amount', 'Borrower1_Mobile', 'Borrower1_Name', 'Borrower2_Mobile', 'Borrower2_Name', 'Borrower3_Mobile', 'Borrower3_Name'].concat(dynamicFields)
      } else {
        let sampleDataMain = dynamicFieldsLeegalityFields
        dynamicFields = ['Template_Id', 'Loan_Id', 'Borrower1_Mobile', 'Borrower1_Name', 'Borrower1_SignType', 'Borrower2_Mobile', 'Borrower2_Name', 'Borrower2_SignType', 'Borrower3_Mobile', 'Borrower3_Name', 'Borrower3_SignType']
        sampleDataMain.forEach((value) => {
          dynamicFields.push(value.name)
        });
        dynamicFields = [...new Set(dynamicFields)]
      }
      const data = dynamicFields.map((field) => ({
        [field]: field === "Template_Id" ? selectedProductId : "" // Assign Template_Id value
      }));

      // Create the Excel sheet
      const worksheet = XLSX.utils.json_to_sheet(data);
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
  const handleFileChange = (e) => {

    let lod = e.target.files;

    // console.log(doc_type);
    setFile(e.target.files[0].name);
    let reader = new FileReader();
    reader.readAsDataURL(lod[0]);
    reader.onload = (e) => {
      // console.log(e.target.result);
      let base64_data;
      base64_data = e.target.result.split("base64,").pop();
      console.log(base64_data);
      setBase64(base64_data)
    };
  };

  // Function to send the file to Digio
  const sendToDigio = async (LoanId,Signer1,Signer2, Signer3, Mobile1, Mobile2, Mobile3, ProductId) => {
    // console?.log(Signer1)
    // console?.log(Signer2)
    // console?.log(Signer3)
    // console?.log(Mobile1)
    // console?.log(Mobile2)
    // console?.log(Mobile3)
    // console?.log(signPartner)
    // console.log(LoanId)
    if (!file) {
      alert("First upload the file.");
      return;
    }
  
    // Validation: Check if the file name matches the Loan ID
    if (file !== `${LoanId}.pdf`) {
      alert("File name must be equal to the Loan ID.");
      return;
    }

    try {
      const res = await axios.post(url + "/template/get", {
        token,
        email,
        ProductId: ProductId,
      });
      const data = res.data?.[0] || {};
      console.log(res.data?.[0]);
      console.log(data?.clientId);
      setSignPartner(data?.signPartner || "");
      setclientId(data?.clientId);
      setclientSecret(data?.clientSecret);
      setclientBase(window.btoa(`${clientId}:${clientSecret}`));
      setstampDutyMethod(data?.stampDutyMethod);
      setstampDutyValue(data?.stampDutyValue);
      setDSC_Name(data?.dscName);
      setDSC_Mobile(data?.dscContact);
      setstampName(data?.stampName);
      // setloanAmount(data?.)


    } catch (err) {
      toast.error(err.message);
    }
    try {
      const res = await axios.post(url + "/api/digio", {
        LoanId,
        name1: Signer1,
        name2: Signer2,
        name3: Signer3,
        mobile1: Mobile1,
        mobile2: Mobile2,
        mobile3: Mobile3,
        signType1: "",
        signType2: "",
        signType3: "",
        clientBase: clientBase,
        stampDutyMethod: stampDutyMethod,
        stampDutyValue: stampDutyValue,
        DSC_Name: DSC_Name,
        DSC_Mobile: DSC_Mobile,
        stampName: stampName,
        loanAmount,
        base64: base64,
        signPartner,
        partnerTemplateId: ProductId,
        token,
        email,
      });
      console.log(res.data)
      const data = res.data;
      console.log(data)
      console.log(clientBase)
      console.log(stampName)
      
      if (!data) {
        alert("No response received from the server.");
        return;
      }
      
      if (signPartner === "Leegality") {
        console.log(data.status);
      
        if (data.status === 1) {
          alert(data.data?.documentId || "Document ID not found.");
          window.location.reload();
        } else if (data.status === 0) {
          alert(data.messages?.[0]?.message || "An error occurred.");
        } else {
          alert((data.message || "Unknown error") + ". Please check the respective API key.");
        }
      } else if (signPartner === "Digio") {
        console.log(data.id);
      
        if (data.id) {
          alert(data.id);
          window.location.reload();
        } else {
          alert(data.message || "An error occurred.");
        }
      } else {
        alert("Invalid sign partner specified.");
      }
      
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

    return (
      <div className="container">
        <div className="sidebar">
          <div>
            <p style={{ color: "lightcoral", fontWeight: "100" }}>Home Page</p>
          </div>

          <div className="sidebar-actions">
            <button onClick={() => (window.location.href = "/addtemplate")} className="btn-primary">
              Add Template
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
                      onChange={(e) => handleFileChange(e)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => sendToDigio(doc.LoanId,doc.Signer1,doc.Signer2, doc.Signer3, doc.Mobile1, doc.Mobile2, doc.Mobile3, doc.ProductId)}
                      className="btn-secondary"
                    >
                      Send
                    </button>
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
