import React, { useState, useEffect } from "react";
import "./ProductTemplate.css";
import axios from "axios";
import { url } from "../../../App";
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';


function AddTemplate() {
  const [productData, setProductData] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectPartner, setSelectPartner] = useState("");
  const [nbfcName, setNbfcName] = useState("");
  const [DSCName, setDSCName] = useState("");
  const [DSCEmailID, setDSCEmailID] = useState("");
  const [leegalityTemplateId, setLeegalityTemplateId] = useState("");
  const [stampSeries, setStampSeries] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [pasteDynamicFeilds, setPasteDynamicFeilds] = useState("");
  const [stampName, setStampName] = useState("")
  const [loanAgreement, setLoanAgreement] = useState("")
  const [selectedOption, setSelectedOption] = useState("");
  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  
  const [stampDutyValue, setStampDutyValue] = useState("");                                              
  const [stampDutyMethod, setStampDutyMethod] = useState("");
  const [signPartner, setSignPartner] = useState("");
  const [productName, setProductname] = useState("");
  const [dynamicFieldsValue, setDynamicFieldsValue] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  
  const [uploadDLA, setUploadDLA] = useState(null);

  // Function to handle adding a new dynamic field
  const addField = () => {
    setDynamicFields([...dynamicFields, dynamicFieldsValue]);
    setDynamicFieldsValue(""); // Clear the input field
  };

  // Function to handle removing a specific field
  const removeField = (index) => {
    const updatedFields = dynamicFields.filter((_, i) => i !== index);
    setDynamicFields(updatedFields);
  };
  console.log(selectedTemplateId)

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  console.log(productData)
  
  const handleSaveTemplate = async () => {
    try {
      const response = await axios.post(url + "/template/insert", {
        Loanagreement: loanAgreement,
        ProductID: selectedTemplateId,
        ProductName: productName,
        apiKey: apiKey,
        clientId: clientID,
        clientSecret: clientSecret,
        dscContact: DSCEmailID,
        dscName: DSCName,
        dynamicFields: dynamicFields,
        dynamicFieldsLeegality: pasteDynamicFeilds,
        email: email,
        nbfcName: nbfcName,
        signPartner: signPartner,
        stampDutyMethod: selectedOption,
        stampDutyValue: stampDutyValue,
        stampName: stampName,
        stampSeries: stampSeries,
        token: token,
      });
      alert('Template Added')
      // Check if the API response indicates success
      if (response.status === 200 || response.status === 201) {
        // Reload the page after the response is processed
        window.location.reload();
      } else {
        // Show an error if the response is not successful
        toast.error("Failed to save template. Please try again.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddTemplate = async () => {
    try {
      // Generate unique ID
      let uniqueIdMain = '';
      productData.forEach((value) => {
        const uniqueId = parseInt(value.Productid.slice(7, 9)) + 1;
        uniqueIdMain = 'CREDIN_' + uniqueId;
      });
  
      const response = await axios.post(url + "/template/insert", {
        Loanagreement: loanAgreement,
        ProductID: uniqueIdMain, // Using the generated uniqueIdMain instead of selectedTemplateId
        ProductName: productName,
        apiKey: apiKey,
        clientId: clientID,
        clientSecret: clientSecret,
        dscContact: DSCEmailID,
        dscName: DSCName,
        dynamicFields: dynamicFields,
        dynamicFieldsLeegality: pasteDynamicFeilds,
        email: email,
        nbfcName: nbfcName,
        signPartner: signPartner,
        stampDutyMethod: selectedOption,
        stampDutyValue: stampDutyValue,
        stampName: stampName,
        stampSeries: stampSeries,
        token: token,
      });
  
      alert('Template Added');
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
      } else {
        toast.error("Failed to save template. Please try again.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const downloadReport = async (loanId) => {
    try {
      // Make the API call
      const response = await axios.post(url + '/api/fetch/documents/file', {
        email,
        loanId,
        token
      });
      
      // Process the response
      const esignDocument = {
        loanId: response.data.loanId,
        esignData: response.data.esignData,
        auditTrail: response.data.auditTrail
      };
  
      // Create and trigger download
      const linkSource = `data:application/pdf;base64,${esignDocument.esignData}`;
      const downloadLink = document.createElement("a");
      const fileName = `${esignDocument.loanId}_Loan_Agreement.pdf`;
      
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!selectedTemplateId) return;

    const fetchData = async () => {
      try {
        const res = await axios.post(url + "/template/get", {
          token,
          email,
          ProductId: selectedTemplateId,
        });
        const data = res.data?.[0] || {};
        console.log(data.clientSecret);
        console.log(data.stampSeries);
        setClientSecret(data.clientSecret);
        setClientID(data.clientId);
        setDSCEmailID(data.dscContact);
        setStampName(data.stampName);
        setDSCName(data.dscName);
        setStampSeries(data.stampSeries);
        setStampDutyValue(data.stampDutyValue);
        setSelectedOption(data.stampDutyMethod);
        setSignPartner(data.signPartner || "");
        setProductname(data.Productname || "");
        setSelectPartner(data.signPartner || "");
        setNbfcName(data.nbfcName || "");
        setLeegalityTemplateId((data.dynamicFieldsLeegality?.templateId) || "");
        setApiKey(data.apiKey || "");
        setPasteDynamicFeilds(data.dynamicFieldsLeegality || {});
        setLoanAgreement(data.Loanagreement || "")
        
      } catch (err) {
        toast.error(err.message);
      }   
    };
    fetchData();
  }, [selectedTemplateId, token, email]);

  useEffect(() => {
    const userToken = localStorage.getItem("TOKEN");
    const userEmail = localStorage.getItem("EMAIL");
    setToken(userToken);
    setEmail(userEmail);

    axios
      .post(url + "/template/getproductname", {
        token: userToken,
        email: userEmail,
      })
      .then((res) => {
        setProductData(res.data);
        console.log(res.data)})

         
      .catch((err) => toast.error(err.message));
  }, []);

  const deleteLoanAgreement = async (ProductID, token, email) => {
    try {
      const response = await axios.post(url + "/template/delete", {
        ProductID,
        token,
        email,
      });
      console.log(response);
  
      // Reload the page only if the response is successful
      if (response.status === 200 || response.status === 204) {
        window.location.reload();
      } else {
        throw new Error("Failed to delete the loan agreement.");
      }
    } catch (err) {
      console.error(err);
      throw err; 
    }
  };
  

  return (
    <div className="addtemplate-container">
      <div className="addtemplate-main">
        <p className="addtemplate-title">Add Template Page</p>

        <div className="button-group">
          <button className="button-home" onClick={() => (window.location.href = "/")}>Home</button>
          <button className="button-upload">Upload</button>
          <button className="button-preview">Preview</button>
          <button className="button-logout">Logout</button>
        </div>

        <div className="form-group template-id-selector">
          <label>Select Template ID</label>
          <select onChange={(e) => setSelectedTemplateId(e.target.value)} value={selectedTemplateId}>
            <option value="">--Select--</option>
            {productData.map((data) => (
              <option value={data.Productid} key={data.Productid}>
                {data.Productid}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group partner-selector">
          <label>Select Partner</label>
          <select value={selectPartner} onChange={(e) => setSelectPartner(e.target.value)}>
            <option value="">--Select--</option>
            <option value="Leegality">Leegality</option>
            <option value="Digio">Digio</option>
          </select>
        </div>

        <div className="form-group nbfc-name">
          <label>NBFC Name</label>
          <input type="text" placeholder="--NBFC Name--" value={nbfcName} onChange={(e) => setNbfcName(e.target.value)} />
        </div>

        <div className="form-group dsc-name">
          <label>DSC Name</label>
          <input type="text" placeholder="--DSC Name--" value={DSCName} onChange={(e) => setDSCName(e.target.value)} />
        </div>

        <div className="form-group dsc-email">
          <label>DSC Email ID</label>
          <input type="text" placeholder="--DSC Contact--" value={DSCEmailID} onChange={(e) => setDSCEmailID(e.target.value)} />
        </div>

        {selectPartner === "Leegality" ? (
          <div className="leegality-container">
            <p className="partner-title">Leegality</p>

            <div className="form-group leegality-template-id">
              <label>Leegality Template ID</label>
              <input type="text" placeholder="--Leegality Template ID--" value={leegalityTemplateId} onChange={(e) => setLeegalityTemplateId(e.target.value)} />
            </div>

            <div className="form-group stamp-series">
              <label>Stamp Series</label>
              <input type="text" placeholder="--Stamp Series--" value={stampSeries} onChange={(e) => setStampSeries(e.target.value)} />
            </div>

            <div className="form-group api-key">
              <label>API Key</label>
              <input type="text" placeholder="--API Key--" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>

            <div className="form-group-dynamic-fields">
              <label>Paste Dynamic Fields</label>
              <input type="text" placeholder="--Dynamic Fields--" value={JSON.stringify(pasteDynamicFeilds)} onChange={(e) => setPasteDynamicFeilds(e.target.value)} />
            </div>
          </div>
        ) : (
          <div className="digio-container">
            <p className="partner-title">Digio</p>

            <div className="form-group stamp-name">
              <label>Stamp Name</label>
              <input type="text" placeholder="--Stamp Name--" value={stampName} onChange={(e) => setStampName(e.target.value)} />
            </div>

            <div className="form-group stamp-duty">
              <label>Stamp Duty</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="stampOption" checked={selectedOption === "fixed"} onChange={() => handleOptionChange("fixed")} />
                  Fixed
                </label>
                <label>
                  <input type="radio" name="stampOption" checked={selectedOption === "percentage"} onChange={() => handleOptionChange("percentage")} />
                  Percentage
                </label>
              </div>
            </div>

            <div className="form-group stamp-value">
              <label>{selectedOption === "fixed" ? "Amount (₹) Both" : "Percentage"}:</label>
              <input type="text" placeholder="--Enter Value--" value={stampDutyValue}/>
            </div>

            <div className="form-group client-id">
              <label>Client ID</label>
              <input type="text" placeholder="--Client ID--" value={clientID} onChange={(e) => setClientID(e.target.value)} />
            </div>

            <div className="form-group client-secret">
              <label>Client Secret</label>
              <input type="text" placeholder="--Client Secret--" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} />
            </div>

            <div className="form-group upload-dla">
              <label htmlFor="fileupload">Upload Dynamic Loan Agreement</label>
              <input type="file" id="fileupload" onChange={(e) => setUploadDLA(e.target.files[0])} />
            </div>

            <div className="dynamic-fields-container">
              <p>Dynamic Fields</p>
              <input type="text" placeholder="--Dynamic Fields--" value={dynamicFieldsValue} onChange={(e) => setDynamicFieldsValue(e.target.value)} />
              <button onClick={addField}>Add</button>

              <div className="dynamic-fields-table">
                <table>
                  <tbody>
                    {dynamicFields.map((field, index) => (
                      <tr key={index}>
                        <td>{field || ""}</td>
                        <td>
                          <DeleteIcon className="delete-icon" alt="Delete" onClick={() => removeField(index)} style={{ cursor: "pointer" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <p className="info-message">If you don't want to use the service, keep it blank.</p>
        <div className="button-group">
          <button className="button-save-update-template" onClick={handleSaveTemplate}>Edit Template</button>
          <button className="button-save-update-template" onClick={handleAddTemplate}>Add Template</button>
        </div>

        <div className="template-table-container">
          <table className="template-table">
            <thead>
              <tr>
                <th>Template ID</th>
                <th>NBFC Name</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {productData?.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.Productid}</td>
                  <td>{doc.nbfcName}</td>
                  <td>
                    <DeleteIcon onClick={() => deleteLoanAgreement(doc.Productid, token, email)} className="delete-icon" style={{ cursor: "pointer", color: "black" }} titleAccess="Delete Product" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
}

export default AddTemplate;
