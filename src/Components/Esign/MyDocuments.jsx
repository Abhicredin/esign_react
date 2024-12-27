import React, { useEffect, useState } from "react";
import "./MyDocuments.css";
import { toast } from "react-toastify";
import { url } from "../../App";
import axios from "axios";

function Home() {
  // Existing state variables
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [documentData, setDocumentData] = useState([]);
  const [documentStatus, setDocumentStatus] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [loanId, setLoanId] = useState("");

  // First table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState([]);

  // Second table pagination and search
  const [currentPage2, setCurrentPage2] = useState(1);
  const [records2, setRecords2] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [filteredDocumentData, setFilteredDocumentData] = useState([]);

  const recordPerPage = 5;

  // Pagination calculations for first table
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const npages = Math.ceil(documentStatus.length / recordPerPage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  // Pagination calculations for second table
  const lastIndex2 = currentPage2 * recordPerPage;
  const firstIndex2 = lastIndex2 - recordPerPage;
  const npages2 = Math.ceil(documentData.length / recordPerPage);
  const numbers2 = [...Array(npages2 + 1).keys()].slice(1);

  // Existing useEffect for initial data fetch
  useEffect(() => {
    const userToken = localStorage.getItem("TOKEN");
    const userEmail = localStorage.getItem("EMAIL");
    setToken(userToken);
    setEmail(userEmail);

    const documentsData = async () => {
      try {
        const res = await axios.post(url + "/api/fetch/documents/data", {
          token: userToken,
          email: userEmail,
        });
        setDocumentData(res.data);
        setFilteredDocumentData(res.data); // Initialize filtered data
      } catch (err) {
        toast.error(err.message);
      }
    };
    documentsData();

    const documentsStatus = async () => {
      try {
        const res = await axios.post(url + "/api/fetch/documents/status", {
          token: userToken,
          email: userEmail,
        });
        setDocumentStatus(res.data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    documentsStatus();
  }, []);

  // Update records for first table
  useEffect(() => {
    setRecords(documentStatus.slice(firstIndex, lastIndex));
  }, [documentStatus, firstIndex, lastIndex]);

  // Update records for second table
  useEffect(() => {
    setRecords2(filteredDocumentData.slice(firstIndex2, lastIndex2));
  }, [filteredDocumentData, firstIndex2, lastIndex2]);

  // Pagination handlers for first table
  function nextPage() {
    if (currentPage !== npages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCurrentPage(id) {
    setCurrentPage(id);
  }

  // Pagination handlers for second table
  function nextPage2() {
    if (currentPage2 !== npages2) {
      setCurrentPage2(currentPage2 + 1);
    }
  }

  function prevPage2() {
    if (currentPage2 !== 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  }

  function changeCurrentPage2(id) {
    setCurrentPage2(id);
  }

  // Search handlers
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    const filtered = documentStatus.filter((item) => {
      return item.Loanid == Number(searchValue);
    });
    setRecords(filtered);
  };

  const handleSearch2 = () => {
    const filtered = documentData.filter((item) => {
      return item.loanId == Number(searchTerm2);
    });
    setFilteredDocumentData(filtered);
    setCurrentPage2(1); // Reset to first page when searching
  };

  const linkFetch = (e) => {
    try {
      navigator.clipboard.writeText(e); // Copy text to clipboard
      alert(`Copied - ${e}`); // Show success alert
    } catch (error) {
      alert(`Failed to copy: ${error}`); // Show error alert
    }
  };

  async function handleDownloadAgreement(loanId) {
    try {
      // Fetch the document from the API
      const response = await axios.post(`${url}/api/fetch/documents/file`, {
        loanId,
        token,
        email,
      });
      console.log(response)
      // Map the response data to extract the required details
      const esignDocument = {
        loanId: response.data.loanId,
        esignData: response.data.esignData,
        auditTrail: response.data.auditTrail,
      };

      // Convert the eSign data to a downloadable link
      const linkSource = `data:application/pdf;base64,${esignDocument.esignData}`;
      const fileName = `${esignDocument.loanId}_Loan_Agreement.pdf`;

      // Create and trigger a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Error Downloading Report");
    }
  }

  async function handleDownloadTrail(loanId) {
    try {
      const response = await axios.post(
        `${url}/api/fetch/documents/file`,
        {
          token,
          email,
          loanId
        }
      );

      console.log(response?.data.auditTrail); // Log audit trail data if needed

      // Check if the response contains base64-encoded PDF data
      const base64Pdf = response?.data?.auditTrail; // Assuming the base64-encoded PDF data is under 'pdfBytes'
      const LID = response?.data.loanId
      if (base64Pdf) {
        // Decode the base64 string and convert to a Blob
        const binaryString = atob(base64Pdf); // Decode base64 string to binary data
        const binaryLen = binaryString.length;
        const byteArray = new Uint8Array(binaryLen);

        // Convert each character in the binary string to its byte equivalent
        for (let i = 0; i < binaryLen; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        // Create a Blob from the byte array
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const newUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = newUrl;
        link.setAttribute('download', `${LID}_Audit_Trail.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(newUrl);
      } else {
        toast.error('No PDF data received');
      }
    } catch (err) {
      console.error("Error downloading file:", err);
      toast.error('Error Downloading File');
    }
  }

  const fetchLoanStatus = async (digioId, loanId) => {
    console.log(digioId);
    console.log(loanId);

    try {
      const response = await axios.post(url + "/api/fetch/status", {
        digioId,
        loanId,
        token,
        email,
      });

      const data = [response.data];
      console.log(response.data)
      const processedData = data.map((esign) => ({
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
      }));

      console.log("Processed Data:", processedData);
      // Reload the page (use sparingly in React)
      // window.location.reload();
    } catch (error) {
      console.error("Error fetching loan status:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  async function handlePreview(loanId, digioId) {
    try {
      // Fetch the document from the API
      const response = await axios.post(`${url}/api/fetch/documents/preview`, {
        digioId,
        loanId,
        token,
        email,
      });
      console.log(response)
      // Map the response data to extract the required details
      const esignPreview = {
        Loanid: response.data.Loanid,
        esignData: response.data.esignData,
        auditTrail: response.data.auditTrail,
      };

      // Convert the eSign data to a downloadable link
      const linkSource = `data:application/pdf;base64,${esignPreview.esignData}`;
      const fileName = `${esignPreview.Loanid}_Preview.pdf`;

      // Create and trigger a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Error Downloading Report");
    }
  }

  return (
    <div className="center-div">
      <div className="main-div">
        {/* <div className="div-main.right">
          <p style={{ "color": "lightcoral" }}>Home Page</p>
        </div> */}
        <div className="navigate-button">
          <button className="btn" onClick={() => (window.location.href = "/")}>Home</button>
          <button class="btn" onClick={logout}>Logout</button>

        </div>
        <div className="table-one">
          <p>sent</p>
          <div className="search-loanid">
            <input
              type="text"
              placeholder="Search Loan ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => handleSearch(searchTerm)}>Search</button>
          </div>
          <table style={{ marginTop: "2vh" }}>
            <thead>
              <tr>
                <th>Loan Id</th>
                <th>ID</th>
                <th>Signer1 Name</th>
                <th>Signer1 Contact</th>
                <th>Signer1 Status</th>
                <th>Signer1 Link</th>
                <th>Signer2 Name</th>
                <th>Signer2 Contact</th>
                <th>Signer2 Status</th>
                <th>Signer2 Link</th>
                <th>Signer3 Name</th>
                <th>Signer3 Contact</th>
                <th>Signer3 Status</th>
                <th>Signer3 Link</th>
                <th>Fetch Details</th>
                <th>Download Agreement</th>
              </tr>
            </thead>
            <tbody>
              {records.map((data) => (
                <tr key={data._id}>
                  <td style={{ "maxWidth": "55px", "wordWrap": "break-word" }}>{data.Loanid}</td>
                  <td style={{ "maxWidth": "100px", "wordWrap": "break-word" }}>{data.digioid}</td>
                  <td style={{ "maxWidth": "100px", "wordWrap": "break-word" }}>{data.Signer1}</td>
                  <td style={{ "maxWidth": "80px", "wordWrap": "break-word" }}>{data.Mobile1}</td>
                  <td>
                    <span style={{ color: data.Signer1status === "true" ? "green" : "red" }}>
                      {data.Signer1status === "true" ? "Completed" : "Not Completed"}
                    </span>
                  </td>
                  <td><button onClick={() => linkFetch(data.url1)} className="signer-link">click</button></td>
                  <td style={{ "maxWidth": "100px", "wordWrap": "break-word" }}>{data.Signer2}</td>
                  <td style={{ "maxWidth": "80px", "wordWrap": "break-word" }}>{data.Mobile2}</td>
                  <td>
                    <span style={{ color: data.Signer2status === "true" ? "green" : "red" }}>
                      {data.Signer2status === "true" ? "Completed" : "Not Completed"}
                    </span>
                  </td>
                  <td><button onClick={() => linkFetch(data.url2)} className="signer-link">click</button></td>

                  <td style={{ "maxWidth": "100px", "wordWrap": "break-word" }}>{data.Signer3}</td>
                  <td style={{ "maxWidth": "80px", "wordWrap": "break-word" }}>{data.Mobile3}</td>
                  <td>
                    <span style={{ color: data.Signer3status === "true" ? "green" : "red" }}>
                      {data.Signer3status === "true" ? "Completed" : "Not Completed"}
                    </span>
                  </td>
                  <td><button onClick={() => linkFetch(data.url3)} className="signer-link">click</button></td>
                  <td><button className="signer-link" onClick={() => fetchLoanStatus(data.digioid, data.Loanid)}>fetch</button></td>
                  <td><button className="signer-link" onClick={() => handlePreview(data.Loanid, data.digioid)}>preview</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prevPage}>Previous</a>
          </li>
          {
            numbers
              .slice(
                Math.max(0, currentPage - 1), // Ensure we don't start before the first page
                Math.min(numbers.length, currentPage + 4) // Ensure we don't go beyond the last page
              )
              .map((n, i) => (
                <li className={`page-item ${currentPage === n ? 'active' : ""}`} key={i}>
                  <a href="#" className="page-link" onClick={() => changeCurrentPage(n)}>{n}</a>
                </li>
              ))
          }
          <li className="page-item">
            <a href="#" className="page-link" onClick={nextPage}>Next</a>
          </li>
        </ul>

        <div className="table-two">
          <p>Completed</p>
          <div className="search-loanid-two">
            <input
              type="text"
              placeholder="Search Loan ID"
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
            />
            <button onClick={handleSearch2}>Search</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Loan Id</th>
              <th>Date</th>
              <th>Download Agreement</th>
              <th>Download Audit Trail</th>
            </tr>
          </thead>
          <tbody>
            {records2.map((data) => (
              <tr key={data._id}>
                <td style={{ maxWidth: "100px", wordWrap: "break-word" }}>{data.loanId}</td>
                <td style={{ maxWidth: "500px", wordWrap: "break-word" }}>{data.esignDate}</td>
                <td><button onClick={() => handleDownloadAgreement(data.loanId)}>Download</button></td>
                <td><button onClick={() => handleDownloadTrail(data.loanId)}>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prevPage2}>Previous</a>
          </li>
          {numbers2
            .slice(
              Math.max(0, currentPage2 - 1),
              Math.min(numbers2.length, currentPage2 + 4)
            )
            .map((n, i) => (
              <li className={`page-item ${currentPage2 === n ? 'active' : ""}`} key={i}>
                <a href="#" className="page-link" onClick={() => changeCurrentPage2(n)}>{n}</a>
              </li>
            ))}
          <li className="page-item">
            <a href="#" className="page-link" onClick={nextPage2}>Next</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;