import React ,{useState , useEffect , useRef} from 'react'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet';
import './App.css'
const App = () => {

const [load, setLoad] = useState(false);
const [model, setModel] = useState(null)
const [imageURL, setImageURL] = useState(null);
const [results, setResults] = useState([])


const fileInputRef = useRef(null)
const imageRef=useRef(null)
const textInputRef=useRef(null)

const loadModel=async ()=>{
  setLoad(true)
  try{
    const mod = await mobilenet.load();
   
    setModel(mod)
    setLoad(false)
  }
  catch(error) {
    console.log(error)
    setLoad(false)
}
}


useEffect(() => {
  loadModel()
 
}, [])

// console.log(model)

  const fileUpload=(e)=>{
    const { files } = e.target
    if (files.length > 0) {
      const url=URL.createObjectURL(files[0])
        
        setImageURL(url)
    } else {
        setImageURL(null)
    }
  }

  const handleOnChange=(e)=>{
    setImageURL(e.target.value)
        setResults([])

  }

  const identifyImage= async ()=>{
    fileInputRef.current.value=""
    textInputRef.current.value=""
    const result= await model.classify(imageRef.current)
    setResults(result)

  }

  console.log(results)



  return (
    <>
    <div className="">
      {
        load ? (
          <>
          <div className="loadding">
      <div className="spinner-grow text-info"></div>
      <br />
      <h5>Loading...</h5>
      </div>

          </>
        ) :
        (
          <>
        <div className="nav ">
       <h2>Image Identification</h2>
     </div>
      <div className="container">
     <div className="row">
       <div className="col-md-8 col-12 mx-auto">
       <h4>Upload Image Or Url</h4>
       <br />
         <div className="row">
          
           <div className="col-md-6 col-12 mb-3 mx-auto ">
           <input type="file" accept='image/*' capture='camera' className="form-control inputtext1 " onChange={fileUpload} ref={fileInputRef} />
           </div>
           <div className="col-md-6 col-12 mb-3 mx-auto">
           <div className="form-group ">
  
            <input type="text" className="form-control inputtext2" id="usr" placeholder="Upload Image Url" ref={textInputRef} onChange={handleOnChange} />
          </div>
             </div>
         </div>
        </div>
        {
          imageURL && (
            <>
            <div className="row mx-auto">
           <div className="col-md-7 col-12 mx-auto mb-3">
            <img src={imageURL} alt="gg"  className="img-fluid box" crossOrigin="anonymous" ref={imageRef} />
           </div>
           <div className="col-md-5 col-12 mx-auto mb-3">
             <button className="btn btn-block btn-dark" onClick={identifyImage}>
             Identify Image
             </button>
             <br /><br />
             {
               results.length > 0  &&(
                 <>
               <div className="card">
             {
               results.map((val,ind)=>{
                 return (
                   <>
                   {
                     ind===0 ?
                     (
                       <>
                       <button className="btn btn-block btn-success" key={ind}>
                     {val.className} ( {(val.probability * 100).toFixed(2)}% )
                     </button>

                       </>
                     ):(
                       <>
                       <button className="btn btn-block btn-info" key={ind}>
                       {val.className} ( {(val.probability * 100).toFixed(2)}% )
                        </button>

                       </>
                     )
                      
                   }

                   </>
                 )
               })
             }
             
              
            
             
            
             </div>
                 </>
               )
             }
            
             </div>
         </div>

            </>
          )
        }
         
      
      </div>

      </div>
          </>
        )
      }
     



    </div>
      
    </>
  )
}

export default App
