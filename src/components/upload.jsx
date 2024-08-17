import React, { useState, useContext } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../AuthContext';

function Upload() {
  const [files, setFiles] = useState([]);
  const [up_message, setUpMessage] = useState("");
  const [dn_message, setDnMessage] = useState("");
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false); // To check if the upload was successful
  const [isProcessing, setIsProcessing] = useState(false); // To check if the process is running
  const [processMessage, setProcessMessage] = useState(""); // Message during processing
  const [isProcessedFilesAvailable, setIsProcessedFilesAvailable] = useState(false); // To check if processed files are available
  // const [processedImages, setProcessedImages] = useState([]); // Store processed images
  const [activeTab, setActiveTab] = useState('upload');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [cameraName, setCameraName] = useState('');
  const { token, username } = useContext(AuthContext);
  const handleFileChange = (e) => {
    // Get the selected files
    const newFiles = Array.from(e.target.files);

    // Update the state with new files
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('file_uploads', file));

      try {
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Files uploaded successfully', response.data);

        // Clear the files and input
        setFiles([]);
        document.getElementById('fileUpload').value = '';

        // Set success message
        setUpMessage("Files uploaded successfully!");
        setIsUploadSuccessful(true); 
      } catch (error) {
        console.error('Error uploading files', error);
        setUpMessage("Error uploading files. Please try again.");
        setIsUploadSuccessful(false);
      }
    }
  };

  const handleDelete = (fileToDelete) => {
    // Remove the file from the list
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
  };

  const handleProcess = async (event) => {
    
    setProcessMessage("This may take a while...");
    event.preventDefault();

    const pollJobStatus = () => {
        const jobStatusInterval = setInterval(async () => {
            try {
                const statusResponse = await axios.get('http://localhost:8000/job_status', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        username: username,
                    }
                });

                const jobStatus = statusResponse.data.job_status;
                setIsProcessing(true);
                if (jobStatus === 'R') {
                    setProcessMessage("HPC has started to process the files (FYI: It takes approx. 6-7 minutes for 2 images)");
                } else if (jobStatus === 'PD') {
                    setProcessMessage("HPC resources are pending \n Please wait...");
                } else {
                    setProcessMessage("Job is still running. Waiting...");
                }

                // Break the loop if job is done
                if (jobStatus !== 'PD' && jobStatus !== 'R') {
                    clearInterval(jobStatusInterval);
                    setIsProcessedFilesAvailable(true);
                    setIsProcessing(false);
                    setProcessMessage("HPC has finished processing the files");
                }
            } catch (error) {
                clearInterval(jobStatusInterval);
                console.error('Error checking job status', error);
                setProcessMessage("Error checking job status. Please try again.");
            }
        }, 5000); // Polling interval (e.g., every 10 seconds)
    };
    pollJobStatus();

    try {
        // Start polling the job status immediately after the process starts
        
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel("HPC is not available to locate resources, try again later.");
        }, 1500000); // 2 minutes timeout

        const response = await axios.post('http://localhost:8000/process', {
            username: username // Pass the username to the backend
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cancelToken: source.token,
        });

        clearTimeout(timeout);
        console.log('Process started successfully', response.data);
        setProcessMessage("Process started successfully!");
        setIsProcessedFilesAvailable(false);
    } catch (error) {
        if (axios.isCancel(error)) {
            console.error(error.message);
            setProcessMessage(error.message);
        } else {
            console.error('Error starting process', error);
            setProcessMessage("Error starting process. Please try again.");
        }
    } finally {
        setIsProcessing(false);
    }
};


  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:8000/download', {
        responseType: 'blob',
        params: {
          username: username,
          start_date : startDate.toISOString().split('T')[0].split('-').reverse().join('-'),
          end_date : endDate.toISOString().split('T')[0].split('-').reverse().join('-'),
          camera_name: cameraName
        }
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        setDnMessage("Downloading successfully");
        link.setAttribute('download', 'processed_stored_images.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setDnMessage("No files found for the given criteria.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setDnMessage("No files found for the given criteria.");
      } else {
        setDnMessage("Error downloading files. Please check the dates and camera name.");
      }
      console.error('Error downloading files', error);
    }
  };


  const handleProcessedDownload = async () => {
    try {
      const response = await axios.get('http://localhost:8000/download_processed', {
        responseType: 'blob', // Ensure the response is a Blob (binary data)
        params: {
          username: username,
        }
      });
      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_files.zip'); // Use appropriate file name and extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading processed files', error);
      setProcessMessage("Error downloading processed files. Please try again.");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cancel', {
        params: {
          username: username,
        }
      });
      setProcessMessage("HPC has been cancelled "+response.data.message);
    } catch (error) {
      console.error('Error cancelling HPC job', error);
      setProcessMessage("Error cancelling HPC job. Please try again.");
    } 
  };

  return (

    <div className="container" >
      <div className="tabs" >
        <button 
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`} 
          onClick={() => setActiveTab('upload')} class="btn btn-outline-light btn-lg px-5 text-black"
        >
          Upload
        </button>
        <button 
          className={`tab ${activeTab === 'download' ? 'active' : ''}`} 
          onClick={() => setActiveTab('download')} class="btn btn-outline-light btn-lg px-5 text-black"
        >
          Download
        </button>
      </div>
      <div className="content">
        {activeTab === 'upload' && (
          <div className="upload">
            <div>
      <h1>Upload Images</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold' }}>Instructions to upload images</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '0', display: 'inline-block', textAlign: 'left' }}>
          <li>PLEASE MAKE SURE YOU ARE CONNECTED TO THE VPN</li>
          <li>Naming convention should be "camera_name_image_name.jpg"</li>
          <li>Select the images you want to upload</li>
          <li>Click on "Upload" button</li>
          <li>Click on "Process" button</li>
          <li>Wait for the process to complete</li>
          <li>Download the processed images</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <input
          id='fileUpload'
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileChange}
        />
        {/* <label htmlFor='fileUpload'>Upload Files</label> */}
      </div>
      <button onClick={handleUpload} class="btn btn-outline-light btn-dark btn-md px-5 text-black">Upload</button>

      {up_message && <p>{up_message}</p>}  {/* Display success or error message */}

      <h1>Selected Images</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {files.map((file, index) => (
          <div key={index} style={{ position: 'relative', margin: '10px' }}>
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            {file && <p>{file.name}</p>}
            <button
              onClick={() => handleDelete(file)}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: '5px',
                fontSize: '14px',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button style={{ margin: '20px' }} onClick={handleProcess} disabled={!isUploadSuccessful || isProcessing} className="btn btn-outline-light btn-dark btn-md px-15 text-black">Process</button>
      <button style={{ margin: '20px' }} onClick={handleCancel} disabled={!isUploadSuccessful} className="btn btn-outline-light btn-dark btn-md px-15 text-black">Cancel Job</button>
      <button style={{ margin: '20px' }} onClick={handleProcessedDownload} disabled={!isProcessedFilesAvailable} className="btn btn-outline-light btn-dark btn-md px-15 text-black">Download Processed Files</button>


        {isProcessing && (
          <div>
            <div className="loader"></div>
            <p>{processMessage}</p>
          </div>
        )}
        {/* {isProcessedFilesAvailable && (
                <div>
                  <h1>Processed Images</h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {processedImages.map((image, index) => (
                      <div key={index} style={{ position: 'relative', margin: '10px' }}>
                        <img
                          src={`http://localhost:8000/${image}`} // Adjust this URL based on your backend
                          alt={`Processed ${index}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        {image && <p>{image.split('/').pop()}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        )}
        {activeTab === 'download' && (
          <div className="download">
            <h2>Download Section</h2>
            <div style={{ textAlign: 'center', padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
              <input
                type='text'
                placeholder='Camera name'
                value={cameraName}
                onChange={(e) => setCameraName(e.target.value)}
                style={{ height: '38px', padding: '5px' }}
              />
            </div>
            <button onClick={handleDownload}>Download</button>
            {dn_message && <p>{dn_message}</p>}
          </div>
        )}
      </div>
    </div>
    

  );
}

export default Upload;
