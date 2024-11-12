import React from 'react';
import api from '../services/api';

function DataUpload({ setData }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.uploadData(formData);
    setData(response.data.data);
  };

  return (
    <div>
      <h2>Upload Data</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default DataUpload;
