import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import "./RepoList.css";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";  // For basic styling
import "codemirror/mode/javascript/javascript"; // Import JS syntax mode
import "./repofile.css";
import 'codemirror/theme/moxer.css'; // Ambiance theme



const RepoList = () => {
  const [data, setData] = useState([]); // Current view
  const [originalData, setOriginalData] = useState(null); // Full response data
  const [currentPath, setCurrentPath] = useState(""); // Current folder path
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState(""); // Store file content
  const [isFileLoading, setIsFileLoading] = useState(false); // For file loading state
  const [isFileClicked, setIsFileClicked] = useState(false); // Track if a file is clicked
  const [filesPath, setFilePath] = useState("");
  const [isFileList, setIsFileList] = useState(false); // Track if files are being fetched by commit
  const [fetchedFileContents, setFetchedFileContents] = useState([]); // Store fetched file contents
  const [repoInfo, setRepoInfo] = useState({commitID: "", realRepoName: "", message: "", count: 0 });
  const [showCodeBox, setShowCodeBox] = useState(false); // State to toggle the box visibility
  const [isCopied, setIsCopied] = useState(false);
  const codeBoxRef = useRef(null); // Reference for the code-link-box
  const codeRef = useRef(null); // Ref for the button
  const [repoLogs, setRepoLogs] = useState([]); // State to store logs data
  const [isLogsView, setIsLogsView] = useState(false); // State to toggle logs view
  const [isCommitLogsView, setIsCommitLogsView] = useState(false); 
  const [commitCount, setCommitCount] = useState(0);
  const [isFileListNotLoading, setIsFileListNotLoading] = useState(true);
  const [isCommitFolderView, setIsCommitFolderView] = useState(false);
  const [myRepoName, setMyRepoName] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [fullURL, setFullURL] = useState("");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMessageLength = () => {

    if (windowWidth < 750) return 35;
    if (windowWidth < 1010) return 40;
    return 50;
  };


    // Function to handle the "Code" button click
    const handleCodeClick = () => {
      setShowCodeBox((prevState) => !prevState); // Toggle visibility
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          codeRef.current && // Ensure the button ref exists
          codeBoxRef.current && // Ensure the code box ref exists
          !codeRef.current.contains(event.target) && // Click is outside the button
          !codeBoxRef.current.contains(event.target) // Click is outside the code box
        ) {
          setShowCodeBox(false); // Hide the code box
        }
      };
  
      document.addEventListener('click', handleClickOutside);
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);

 
    const fetchData = async (commits = null) => {
      try {
        setIsCommitFolderView(false);
        setIsLogsView(false);
        setIsLoading(true);
        let commit = commits;
      const pathParts = window.location.pathname.split("/").filter(Boolean);
const repoName = pathParts.slice(-2).join("/"); // Join the last two parts with a "/"
let realRepoName = repoName.split("/")[1];
realRepoName = realRepoName.charAt(0).toUpperCase() + realRepoName.slice(1);
const cleanPath = window.location.pathname.endsWith("/") 
? window.location.pathname.slice(0, -1) 
: window.location.pathname;
const fullURL = `https://codeslot.in${cleanPath}`;
setFullURL(fullURL);

const encodedRepoName = encodeURIComponent(repoName);
setMyRepoName(encodedRepoName);

let url = `https://gitspace.duckdns.org:3002/repo/user/details/${encodedRepoName}`;

// Append query parameter if commitID is provided
if (commit) {
  url += `?commitID=${encodeURIComponent(commit)}`;
}

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

  // Use axios.post to send the request with a body
  const response = await axios.post(url, {token, username}).catch((error) => {
    // Handle error case: Set default data
    console.error("Error fetching data:", error);
    setRepoInfo({
      commitID: "no commits",
      realRepoName: realRepoName,
      message: "Waiting for the first commit!",
      count: 0,
    });
    setIsLoading(false);
    return;
  });
  



        // Extract commitData from the response
        const { commitData, commitID, message, date, count } = response.data;
        console.log(response.data);
        console.log(commitData);
  
  
        // Log commit details (Optional: For debugging or display purposes)
        console.log("Commit ID:", commitID);
        console.log("Commit Message:", message);
        console.log("Commit Date:", date);
        console.log("Commit Count:", count);
  
        // Store the original data for future use
        setOriginalData(commitData); // Store only commitData
  
    if(!commit){ 
        setRepoInfo({  realRepoName,
          commitID,
          message: message,
          count: count });
          setCommitCount(count);
        setIsCommitLogsView(false);}else{
          setRepoInfo({commitID, count: commitCount});
          setIsCommitLogsView(true);
        }

      

        // Update the view based on current path
        updateView("");
        setIsLoading(false);
      } catch (error) {
    
        setIsLoading(false);

        console.error("Error fetching data:", error);
      }
    };


  useEffect(() => {
    fetchData();
  }, []);

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

  // Re-run updateView when originalData or currentPath changes
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
    console.log(currentPath)
    // Split the current path into parts and go up one level
    const parentPath = currentPath
      .split("\\") // Split the path into parts
      .slice(0, -1) // Remove the last segment (go up one level)
      .join("\\"); // Rejoin into a string for the parent path
      console.log(parentPath);

    // If the parentPath is an empty string, it means we are at the root, so we set it to a default folder path
    updateView(parentPath || ""); // Update the view to the parent path
    setIsFileClicked(false); // Mark that no file is clicked
  };
  const handleGoBacks = () => {
    updateView(currentPath); // Update the view to the parent path
    setIsFileClicked(false); 
  }
  const handleGoBackBack = () => {
    setIsFileList(false);
    setFetchedFileContents([]);
    
    if (isCommitFolderView) {
      fetchRepoLogs(); // Call fetchRepoLogs if isLogsView is true
    } else {
      updateView(currentPath); // Otherwise, update the view to the parent path
    }
  };

  // Handle file click to fetch and show file content
  const handleFileClick = async (filePath, commitID) => {
    try {
      setIsFileClicked(true); // Mark that a file was clicked
      setIsFileLoading(true); // Start loading file content
      setFilePath(filePath);
  
      const fixedPath = filePath.replace(/\\/g, "/"); // Replace all backslashes with forward slashes
      let encodedPath = encodeURIComponent(fixedPath); // Encode the path
  
      // If commitID is provided, find the file and append query params
      if (commitID && originalData) {
        const dataArray = Object.values(originalData);
        const fileDetails = dataArray.find(
          (item) => item.path === filePath && item.commit_id === commitID
        );
  
        if (fileDetails) {
          const { id: inode } = fileDetails;
          encodedPath = `${encodedPath}/?commit=${encodeURIComponent(commitID)}&inode=${encodeURIComponent(inode)}`;
        } else {
          console.error("File with the specified commitID not found");
        }
      }
  
      const response = await axios.get(
        `https://gitspace.duckdns.org:3002/repo/user/details/${myRepoName}/file/${encodedPath}`
      );
  
      setIsFileLoading(false); // Stop loading
      console.log(response);
      setFileContent(response.data.content || "File is empty");
    } catch (error) {
      console.error("Error fetching file content:", error);
      setIsFileLoading(false);
      setFileContent("");
    }
  };
  

  // Function to fetch files by commit_id and droppable=false
const fetchFilesByCommit = async (commitId) => {
  setIsFileListNotLoading(false);
  let oldCommits = false;
  try {
    console.log("Starting fetchFilesByCommit for commitId:", commitId);

    setIsLogsView(false);
    setIsFileList(true); // Indicate that files are being fetched

    // Ensure the original data is available
    if (!originalData) {
      console.error("Original data is not available");
      setIsFileList(false); // Reset the file list indicator if data is unavailable
      return;
    }

    console.log("Original data:", originalData);

    // Convert originalData object to an array of values
    const dataArray = Object.values(originalData);

    // Filter the files based on commit_id and change === true
    let filesToFetch = dataArray.filter(
      (item) =>
        item.commit_id === commitId && item.change === true && item.droppable === false
    );

    console.log("Filtered files with change=true:", filesToFetch);

    if (filesToFetch.length === 0) {
      console.log("No files with change=true, fetching older commits.");
      filesToFetch = dataArray.filter(
        (item) => item.commit_id === commitId && item.droppable === false
      );
      oldCommits = true;
    }
    if(filesToFetch.length === 0){
      setFetchedFileContents([]);
      setIsFileListNotLoading(true);
  
    }
    console.log("Files to fetch:", filesToFetch);

    // Fetch content for each file path
    const fetchedFileContentsTemp = [];

    for (let file of filesToFetch) {
      console.log("Processing file:", file);

      const filePath = file.path;
      const fileMessage = file.message;
      const fileCommit = file.commit_id;
      const fileID = file.id;
      const fileDate = file.date;
      const fixedPath = filePath.replace(/\\/g, "/");

      console.log("Fixed path:", fixedPath);

      let encodedPath = encodeURIComponent(fixedPath);
      if (oldCommits) {
        encodedPath = `${encodedPath}/?commit=${encodeURIComponent(fileCommit)}&inode=${encodeURIComponent(fileID)}`;
        console.log("Encoded path for old commits:", encodedPath);
      }

      try {
        const response = await axios.get(
          `https://gitspace.duckdns.org:3002/repo/user/details/${myRepoName}/file/${encodedPath}`
        );

        console.log(`Fetched response for ${filePath}:`, response.data);

        // Store file content
        fetchedFileContentsTemp.push({
          path: filePath,
          content: response.data.content || "File is empty",
          message: fileMessage,
          date: fileDate,
        });

        console.log(`Successfully fetched content for: ${filePath}`);
      } catch (error) {
        console.error(`Error fetching content for file ${filePath}:`, error.message);
        continue; // Skip this file and proceed
      }
    }

    console.log("Fetched file contents:", fetchedFileContentsTemp);
    // Update the state with the fetched file contents
    setFetchedFileContents(fetchedFileContentsTemp);
    setIsFileListNotLoading(true);

  } catch (error) {
    console.error("Error fetching files by commit:", error);
    setFetchedFileContents([]);
  setIsFileListNotLoading(true);
  }
};



    const fetchRepoLogs = async () => {
      try {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const repoName = pathParts.slice(-2).join("/");
        const encodedRepoName = encodeURIComponent(repoName);
    setIsLoading(true);
        const response = await axios.get(`https://gitspace.duckdns.org:3002/repo/user/details/${encodedRepoName}/logs`);
        console.log("Logs fetched:", response.data);
    
        const reverseData = [...response.data].reverse(); // Create a copy and reverse the array


        setRepoLogs(reverseData); // Store the logs
        setIsLogsView(true); // Switch to logs view
        setIsLoading(false)
        setIsCommitFolderView(true);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching logs:", error);
      }
    };
    
// Add a return block for the logs view
if (isLogsView) {
  return (
   
    <div className="repo-list">
    <div className="repo-header">
<p><i className="fa-solid fa-code" style={{color: "white"}}></i>&nbsp; Commits</p>
 <span style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" } }>

 <p  style={{fontSize:"13px", fontWeight: "500"}} className="ptr-cursor" onClick={fetchRepoLogs}><i className="fas fa-code-commit"></i> {repoInfo.count} Commits</p></span>
</div>
    <div className="repo-files">
    <button className="folder-btn go-to-repo-btn" onClick={() => fetchData()}>
        &nbsp;&nbsp;<i class="fa-solid fa-reply"></i>&nbsp;Go to Original Repository
      </button>
      <ul className="repo-ul" style={{listStyleType: "none", marginLeft: "0", paddingLeft: "0"}}>
        {repoLogs.length > 0 ? (
          repoLogs.map((log, index) => (
            <li key={index} className="repo-item" 
            style={{
              borderTop: "1px solid #b7bdc8",
              borderBottom: "none"
            }}>
              <div  style={{
              cursor: "pointer",
              fontSize: "14px"
            }}>
              <i
                    className= "fa-solid fa-folder"
                    style={{ marginRight: "8px" }}
                  ></i>  <span className="textValue" onClick={() => fetchData(log.commitID)} >{log.commitID}</span>
              </div>
              <div className="test">
                <div className="center-elements" title={log.message}  onClick={() => fetchFilesByCommit(log.commitID)}>
                {log.message.length > 50
                      ? log.message.substring(0, 50) + "..."
                      : log.message}</div>
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div className="center-elements2">
                {log.date
                  ? formatDistanceToNow(new Date(log.date), { addSuffix: true })
                  : "Date not available"}
                  
              </div>
            </li>
          ))
        ) : (
          <p>No logs available.</p>
        )}
      </ul>
    </div>
    </div>
  );
}
    if (isFileList) {
      return (
        <>
          <p style={{display: "flex",
            justifyContent: "flex-start"
          }}><button className="folder-btn" onClick={handleGoBackBack} title="Back">
         <i className="fa-solid fa-arrow-left path" style={{color: "white"}}></i>
         &nbsp;&nbsp;<span style={{color: "white", fontSize: "1rem"}}>Files included in this commit are listed below</span>
        </button></p>
          
          <ol style={{
            paddingLeft:"0.75rem"
          }}>
          {isFileListNotLoading ? (
  fetchedFileContents.map((file, index) => (
    <li key={index}>
      <div className="repo-list">
        <div className="repo-files">
          <button className="folder-btn" onClick={handleGoBackBack} title="Back">
            &nbsp;&nbsp;&nbsp;<i className="fa-solid fa-arrow-left path"></i>
            <i className="path">
              &nbsp;&nbsp;{file.path}&gt;
              <i title={file.message}>
                &nbsp;&nbsp;
                {file.message.length > 50
                  ? file.message.substring(0, 50) + "..."
                  : file.message}
              </i>
              &nbsp;&bull;&nbsp;
              {file.date
                ? formatDistanceToNow(new Date(file.date), {
                    addSuffix: true,
                  })
                : "Date not available"}
            </i>
          </button>

          <div className="file-content">
            {isFileLoading ? (
              <div>Loading file content...</div>
            ) : (
              <pre className="pres">
                <CodeMirror
                  value={file.content} // Use the content of the file
                  options={{
                    mode: "javascript",
                    lineNumbers: true,
                    readOnly: true,
                    theme: "moxer",
                  }}
                />
              </pre>
            )}
          </div>
        </div>
      </div>
      <br></br>
    </li>
  ))
) : (
  <p className="center-the-div">Loading...</p>
)}

          </ol>
        </>
      );
    }
  // If the file is clicked, show the file content view
  if (isFileClicked) {
    return (
      
     <>
    <div className="repo-list">
      <div className="repo-files">
        <button className="folder-btn" onClick={handleGoBacks} title="Back">
          &nbsp;&nbsp;&nbsp;<i className="fa-solid fa-arrow-left path"></i>
          <i className="path">&nbsp;&nbsp;{filesPath}&gt;</i>
        </button>

        <div className="file-content">
          {isFileLoading ? (
            <div className="the-center-div">Loading file content...</div>
          ) : (
            <pre className="pres">
              <CodeMirror
                value ={fileContent}
                options={{
                  mode: "javascript",
                  lineNumbers: true,
                  readOnly: true,
                   theme: "moxer",
                }}
              />
            </pre>
          )}
        </div>
      </div>
      </div>
      </>
    );
  }

  // Show file explorer if no file is clicked
  if (isLoading) return <div className="center-the-div">Loading...</div>;

  return (
    <div className="repo-list">
      
     <div className="repo-header">
     {isCommitLogsView ? (
  <>
    <p><i className="fa-solid fa-code" style={{ color: "white" }}></i> &nbsp;Commits </p>
    <span
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{ fontSize: "13px", fontWeight: "500" }}
        className="ptr-cursor"
        onClick={fetchRepoLogs}
      >
        <i className="fas fa-code-commit"></i> {repoInfo.count} Commits
      </p>
    </span>
  </>
) : (
  <>
    <p className="the-repo-header-title">
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
        {repoInfo.realRepoName || "Repository"}
      </span>
      <span className="the-repo-header-slash">-&nbsp;</span>
      <i
        className="latest-commit ptr-cursor"
        onClick={() => fetchFilesByCommit(repoInfo.commitID)}
        title={repoInfo.message}
      >
        {repoInfo.message.length > getMessageLength()
          ? `${repoInfo.message.substring(0, getMessageLength())}...`
          : repoInfo.message || "Waiting for the first commit!"}
      </i>
    </p>
    <span
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        type="submit"
        className="code-btn create-repo-btn"
        onClick={handleCodeClick}
        ref={codeRef}
      >
        <span className="dNone-repo-nav">Code &nbsp;</span> <span className="inverted-triangle">&#9660;</span>
      </button>
      &nbsp;&nbsp;
      <p
        style={{ fontSize: "13px", fontWeight: "500" }}
        className="ptr-cursor"
        onClick={fetchRepoLogs}
      >
        <i className="fas fa-code-commit"></i> {repoInfo.count} Commits
      </p>
    </span>
    {showCodeBox && (
      <div className="code-link-box" ref={codeBoxRef}>
        <div className="code-link-box-content">
          <button
            className="code-link-box-btn"
            onClick={() => {
              const textToCopy = `https://codeslot.in${window.location.pathname}`;
              navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                })
                .catch((err) => console.error("Failed to copy text: ", err));
            }}
          >
       
            {fullURL}&nbsp;
            {isCopied ? (
              <i
                className="fa-solid fa-check"
                style={{ color: "#2fad4e" }}
              ></i>
            ) : (
              <i className="fa-regular fa-copy"></i>
            )}
          </button>
        </div>
        <div className="code-link-box-para">
          <p>
            Use this URL with the command &nbsp;"slot remote add &lt;url&gt;" &nbsp;to add this repository as a remote repository
          </p>
        </div>
      </div>
    )}
  </>
)}
</div>

{isCommitLogsView && (
  <span style={{ borderBottom: "1px solid #b7bdc8", padding: "none", margin: "none" }}>
    <button className="folder-btn go-to-repo-btn" onClick={() => fetchData()}>
      &nbsp;&nbsp;<i class="fa-solid fa-reply"></i>&nbsp;Go to Original Repository
    </button>
  </span>
)}
{isCommitLogsView && !currentPath && !isFileClicked &&
 (<span style={{ borderBottom: "1px solid #b7bdc8", padding: "none", margin: "none" }} >
      <button className="folder-btn" onClick={fetchRepoLogs} title="Back">
        &nbsp;&nbsp;&nbsp;<span className="path-baseline">
          <i className="fa-solid fa-arrow-left path"></i>
          <i className="path">&nbsp;&nbsp;{repoInfo.commitID}&gt;</i>
        </span>
      </button></span>
    )}
    
    {currentPath && !isFileClicked && (
      <button className="folder-btn" onClick={handleGoBack} title="Back">
        &nbsp;&nbsp;&nbsp;<span className="path-baseline">
          <i className="fa-solid fa-arrow-left path"></i>
          <i className="path">&nbsp;&nbsp;{currentPath}&gt;</i>
        </span>
      </button>
    )}

      {/* Repo Files List */}
      <div className="repo-files">
        {data.length > 0 ? (
          <ul className="repo-ul">
            {data.map((value, index) => (
              <li
                key={index}
                className="repo-item"
                style={{
                  borderTop: currentPath && index === 0 ? "1px solid #b7bdc8" : "none",
                }}
              >
                <div

       
                  onClick={() =>
                    value.droppable 
                    ? handleFolderClick(value.path) 
                    : isCommitLogsView 
                      ? handleFileClick(value.path, value.commit_id) 
                      : handleFileClick(value.path)
                  }
                  style={{
                    cursor: value.droppable ? "pointer" : "pointer",
                    fontSize: "14px"
                  }}
                >
                  <i
                    className={value.droppable ? "fa-solid fa-folder" : "fa-regular fa-file"}
                    style={{ marginRight: "8px" }}
                  ></i>
                  <span className="textValue">{value.text}</span>
                </div>
                <div className="test">
                  <div className="center-elements" title={value.message}  onClick={() => fetchFilesByCommit(value.commit_id)}>
                    {value.message.length > getMessageLength()
                      ? value.message.substring(0, getMessageLength()) + "..."
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
          <>
          <div className="center-the-div">
          <img
          className="img-sleepy-sloth"
                        src="/sleepysloth.png"
                        alt="Sleepy Sloth"
                    />
          <h3>Wow, such empty</h3>
          </div>
         
          </>
        )}
      </div>
    </div>
  );
};

export default RepoList;