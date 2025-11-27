"use client";
import React, { useState } from "react";
import { Typography, Box } from "@mui/material";

const FileUploadButton = ({ onChange }) => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          setSelectedFile(file.name);
          onChange(event); // <-- call parent's handler
        }
      };

      
  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
        <label
        htmlFor="file-upload"
        style={{
            display: "inline-block",
            padding: "10px 16px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
        >
        Choose File
        <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the default input
        />
        </label>

        {/* Display Selected File Name */}
        {selectedFile && (
            <Typography
            variant="body2"
            sx={{
                maxWidth: "200px",    // Adjust based on your layout
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word", // Ensures wrapping for extra-long words
            }}
            title={selectedFile} // Tooltip to show full name on hover
            >
            {selectedFile}
            </Typography>
        )}
    </Box>
  );
};

export default FileUploadButton;
