import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {

  const [files, setFiles] = useState([])
  const [imagesData, setImagesData] = useState([])

  useEffect(() => {
    getImages()
  }, [])

  const handleFileChange = (e) => {
    // convert filesLIst to array and update state
    // Limit the files the user can upload
    const selectedFiles = Array.from(e.target.files).slice(0, 10); 
    setFiles(selectedFiles)
  };

  const handleUpload = (e) => {
    if (files.length > 0) {
      console.log(files)
      const formData = new FormData() 
      files.forEach(file => {
        formData.append('files', file)
      });

      axios.post("http://localhost:3001/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => console.log("Response: ", res))
        .catch(err => console.log("Error: " ,err))
    } else {
      console.log('No file selected')
    }
  };

  // Get all images
  const getImages = () => {
    axios.get("http://localhost:3001/getImage", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log("Response: ", res)
        setImagesData(res.data.map(item => item.image.map(img => `http://localhost:3001/images/${img.replace(/^public\\images\\/, '')}`)).flat())
        console.log(imagesData)
      })
      .catch(err => console.log("Error: ", err)
    )
  }


  return (

    <div>
      <input 
        type="file"
        id="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}  
      />
      <button 
        onClick={handleUpload}
      >
        Upload
      </button>

      <div>
        <button onClick={getImages}>Get Images</button>
        <div>
          {imagesData.map((img, index) => (
            <img key={index} src={img} alt={`Uploaded ${index}`}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
