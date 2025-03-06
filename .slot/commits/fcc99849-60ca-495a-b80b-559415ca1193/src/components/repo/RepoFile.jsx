import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import "./RepoList.css";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";  // For basic styling
import "codemirror/mode/javascript/javascript"; // Import JS syntax mode
import "./repofile.css";

const RepoList = () => {
  const [data, setData] = useState([]); // Current view
  const [originalData, setOriginalData] = useState(null); // Full response data
  const [currentPath, setCurrentPath] = useState(""); // Current folder path
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState(""); // Store file content
  const [isFileLoading, setIsFileLoading] = useState(false); // For file loading state
  const [isFileClicked, setIsFileClicked] = useState(false); // Track if a file is clicked

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoName = encodeURIComponent("codeslot/codeslot");
        const response = await axios.get(
          `https://gitspace.duckdns.org:3002/repo/user/details/${repoName}`
        );

        setOriginalData(response.data); // Update full data
        updateView(currentPath || ""); // Update view based on current path
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data initially
    fetchData();
  }, []); // Empty dependency array to run this only once initially

  // Function to update the view based on the current path
  const updateView = (path) => {
    if (!originalData) return;

    const filteredData = Object.values(originalData)
      .filter(
        (item) =>
          item.path.startsWith(path) &&
          item.path.split("\\").length === (path ? path.split("\\").length + 1 : 1)
      )
      .sort((a, b) => b.droppable - a.droppable); // Sort folders first

    setData(filteredData);
    setCurrentPath(path);
  };

  // Re-run updateView when `originalData` or `currentPath` changes
  useEffect(() => {
    if (originalData) {
      updateView(currentPath || ""); // Trigger updateView when data or path changes
    }
  }, [originalData, currentPath]);

  // Handle folder click
  const handleFolderClick = (folderPath) => {
    updateView(folderPath);
  };

  // Handle going back to the parent folder
  const handleGoBack = () => {
    // Split the current path into parts and go up one level
    const parentPath = currentPath
      .split("\\") // Split the path into parts
      .slice(0, -1) // Remove the last segment (go up one level)
      .join("\\"); // Rejoin into a string for the parent path

    // If the parentPath is an empty string, it means we are at the root, so we set it to a default folder path
    updateView(parentPath || ""); // Update the view to the parent path
    setIsFileClicked(false); // Mark that no file is clicked
  };

  // Handle file click to fetch and show file content
  const handleFileClick = async (filePath) => {
    try {
      setIsFileClicked(true); // Mark that a file was clicked
      setIsFileLoading(true); // Start loading file content
      const fixedPath = filePath.replace(/\\/g, "/"); // Replace all backslashes with forward slashes
      const encodedPath = encodeURIComponent(fixedPath); // Then encode the path

      const response = await axios.get(
        `https://gitspace.duckdns.org:3002/repo/user/details/codeslot%2Fcodeslot/${encodedPath}`
      );
      setFileContent(response.data.content || "File is empty");
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Failed to fetch file content.");
    } finally {
      setIsFileLoading(false); // Stop loading once done
    }
  };

  // If the file is clicked, show the file content view
  if (isFileClicked) {
    return (
      <div className="repo-file">
        <button className="folder-btn" onClick={handleGoBack}>
          &nbsp;&nbsp;&nbsp;<i className="fa-solid fa-arrow-left path"></i>
          <i className="path">&nbsp;&nbsp;&nbsp;Back</i>
        </button>

        <div className="file-content">
          {isFileLoading ? (
            <div>Loading file content...</div>
          ) : (
            <pre>
              <CodeMirror
                value={fileContent}
                options={{
                  mode: "javascript",
                  lineNumbers: true,
                  readOnly: true,
                }}
              />
            </pre>
          )}
        </div>
      </div>
    );
  }

  // Show file explorer if no file is clicked
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="repo-list">
      <div className="repo-header">
        <p>
          <i>File Explorer</i>
        </p>
      </div>

      {/* Go Back Button */}
      {currentPath && !isFileClicked && (
        <button className="folder-btn" onClick={handleGoBack}>
          &nbsp;&nbsp;&nbsp;<i className="fa-solid fa-arrow-left path"></i>
          <i className="path">&nbsp;&nbsp;&nbsp;{currentPath}</i>
        </button>
      )}

      {/* Repo Files List */}
      <div className="repo-files">
        {data.length > 0 ? (
          <ul>
            {data.map((value, index) => (
              <li
                key={index}
                className="repo-item"
                style={{
                  borderTop: currentPath && index === 0 ? "1px dotted #ddd" : "none",
                }}
              >
                <div
                  onClick={() =>
                    value.droppable ? handleFolderClick(value.path) : handleFileClick(value.path)
                  }
                  style={{
                    cursor: value.droppable ? "pointer" : "pointer",
                  }}
                >
                  <i
                    className={value.droppable ? "fa-solid fa-folder" : "fa-regular fa-file"}
                    style={{ marginRight: "8px" }}
                  ></i>
                  {value.text}
                </div>
                <div className="test">
                  <div className="center-elements" title={value.message}>
                    {value.message.length > 50
                      ? value.message.substring(0, 50) + "..."
                      : value.message}
                  </div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="center-elements2">
                    {value.date
                      ? formatDistanceToNow(new Date(value.date), {
                          addSuffix: true,
                        })
                      : "Date not available"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files or folders available</p>
        )}
      </div>
    </div>
  );
};

export default RepoList;
