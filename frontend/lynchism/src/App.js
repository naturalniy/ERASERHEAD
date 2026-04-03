import React, { useEffect,useState } from 'react';
import { refreshTokens } from './api';
import './App.css'
import './Fades.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes, useParams, useNavigate, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header'; 
import Footer from './Footer';
import { stringify } from 'postcss';

function valuetext(value) {
  return `${value}°C`;
}

function Home(){
  const navigate = useNavigate()
  return (
    <>
      <div className="relative w-full h-[500px] overflow-hidden border-y border-zinc-900">
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <img 
          src="https://i.ibb.co/t5SBjSQ/PLOHOYPAREN-online-video-cutter-com-2.gif" 
          alt="visual"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <button onClick={() => navigate("/catalog")} className="border border-white text-white px-8 py-3 uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all">
            View_Collection
          </button>
        </div>
      </div>
    </>
  )
}

function Catalog(){
  const [value, setValue] = useState([0, 10000]);
  const [size, setSize] = useState("")
  const [category, setCategory] = useState("")
  const [minOfMax, setMinOfMax] = useState(0)


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // useEffect(() => {

  // },[value,size,category]);
  
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const navigate = useNavigate();


  
 useEffect(() => {
  const getProducts = async () => {
    dispatch({ type: "FETCH_PRODUCTS_LOADING" });
    try {
      let response = await fetch("https://localhost:7064/Product/GetProducts");
      if (!response.ok && response.status === 401) {
        console.warn("SYSTEM_SYNC // 401_UNAUTHORIZED // ATTEMPTING_REFRESH");
        const isRefreshed = await refreshTokens();
        
        if (isRefreshed) {
          response = await fetch("https://localhost:7064/Product/GetProducts");
        } else {
          localStorage.clear();
          navigate("/login");
          return;
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "SYSTEM_SYNC_ERROR");
      }

      const data = await response.json();
      console.log(data);
      dispatch({ type: "SET_PRODUCTS", payload: data });

    } catch (err) {
      console.error("SYSTEM_FAILURE // FETCH_PRODUCTS_FAILED:", err);
    }
  };

  if (products.length === 0) {
    getProducts();
  }
}, [dispatch, products.length, navigate]);




  if (loading) {
    console.log("loading...")
    return <h1 className="loader">downloading products...</h1>;
  }
  const filteredProducts = products.filter((product) => {
    const isPriceOk = product.price >= value[0] && product.price <= value[1];
    const isCategoryOk = category === "" || product.category === category || category === "All";
    const isSizeOk = size === "" || product.sizes.some(s => s.size === size && s.quantity > 0) || size === "All";
    return isPriceOk && isCategoryOk && isSizeOk;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => minOfMax === 1 ? a.price - b.price : b.price - a.price);
  return (
    <>
      <div className='bg-[#0f0f0f] min-h-screen p-10 '>
          <div className=''>
            <div className="flex flex-col">
            <h1 className="text-white text-[80px] font-light tracking-tighter leading-none">
              CATALOG
            </h1>
            <p className="text-zinc-600 text-[13px] uppercase tracking-[0.3em] mt-2 ml-1 max-w-[390px] leading-relaxed">
              “Never let anyone put their long fingers into your plans.” — D. Lynch
            </p>
          </div>
          <div className="border-t border-white/10 w-full mt-5"></div>
          <div className='flex justify-start items-center bg-black py-3 flex-nowrap'>
              <div className='flex flex-col text-white mr-[60px]'>
              <span className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>Availability size</span>
              <select className='bg-black text-white outline-none uppercase font-bold text-[15px] tracking-wide cursor-pointer '
                onChange={(e) => setSize(e.target.value)}>
                <option value="All">ALL</option>
                <option value="M">M</option>
                <option value="S">S</option>
                <option value="L">L</option>
              </select>
            </div>
            <div className='flex flex-col text-white mr-[60px]'>
              <span className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>Category</span>
              <select className='bg-black text-white outline-none font-bold text-[15px] tracking-wide cursor-pointer w-[150px]' 
                onChange={(e) => setCategory(e.target.value)}>
                <option value="All">ALL</option>
                <option value="Tops">Tops</option>
                <option value="Pants">Pants</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className='flex flex-col text-white mr-20'>
              <span className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>Expensive</span>
              <button className='bg-black text-white outline-none font-bold text-[15px] tracking-wide cursor-pointer hover:text-zinc-400 transition-all duration-100' 
                onClick={() => setMinOfMax(prev => (prev === 0 ? 1 : 0))}>
                {minOfMax === 0 ? "Price: High-Low" : "Price: Low-High"}
              </button>
            </div>
            <div className='flex flex-col text-white min-w-[200px] ml-auto'>
              <div className='flex flex-col text-white mr-20'>
                <span className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>Price range: <b>[{value[0]}-{value[1]}]</b></span>
                <Box sx={{ width: 200}}>
                  <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    min={0}
                    max={10000} 
                    step={50}
                  />
                </Box>
              </div>
            </div>
            
            
            
          </div>
          <div className="border-t border-white/10 w-full mb-5"></div>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
          {sortedProducts.map(product => (
            <div onClick={() => navigate(`/product/${product.id}`)} key={product.id} className="animate-fade-in group border bg-black border-white/5 p-4 hover:border-white/25 transition-all duration-500 cursor-pointer">
              <div className="overflow-hidden aspect-[3/4] flex items-center justify-center">
                <img className='w-full bg-[#0d0d0d] group-hover:scale-105 transition-all duration-700 object-contain' src={product.imageURL} alt={product.name} />
              </div>
              <div className='flex text-white justify-between'>
                <h2 className='uppercase tracking-[0.2em] font-light'>{product.name}</h2>
                <span className='font-mono text-sm'>${product.price}</span>
              </div>
              <span className='text-[10px] text-zinc-600 uppercase mt-1 tracking-widest'>{product.category}</span>
              <div className='mt-4 pt-4 border-t border-white/10 flex gap-2'>
                <span className='text-[9px] text-zinc-700 uppercase tracking-tighter'>Available:</span>
                {product.sizes && product.sizes.length > 0 ? (
                    product.sizes
                      .filter(s => s.quantity > 0)
                      .map(s => (
                        <span key={s.id} className='text-[9px] text-zinc-400 uppercase font-bold px-1'>
                          {s.size}
                        </span>
                      ))
                    ) : (
                      <span className='text-[9px] text-red-900 uppercase'>Sold Out</span> // если вообще размеров нету
                    
                  )}
                  {product.sizes && product.sizes.filter(s => s.quantity > 0).length === 0 && (
                    <span className='text-[9px] text-red-900 uppercase'>Sold Out</span>
                  )}
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </>
  )
  
}

function ProductPage({ updateCart }){
  const { id } = useParams();
  const [product, setProduct] = useState()
  const [selectedSize,setSelectedSize] = useState("")
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`https://localhost:7064/Product/${id}`)
    .then(res => res.json())
    .then(data => {
      setProduct(data)
      console.log(data)
  })
    .catch(err => console.error("Error when receiving product:", err))
  },[id])
  const addToCart = async (e) => {
    e.preventDefault()

    try{
      var token = localStorage.getItem("access_token")
      if(token == null) navigate("/login")
      const response = await fetch(`https://localhost:7064/Cart/add-to-cart`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: JSON.stringify({ 
          productId: id,         
          quantity: 1,             
          size: selectedSize       
      })
      })
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return addToCart(e);
          } else {
            localStorage.clear();
            navigate("/login");
            return;
          }
        }
        const errorText = await response.text(); 
        throw new Error(errorText || "Что-то пошло не так");
      }
      else{
        console.log(product)
        updateCart();
        setShowModal(true);
        updateCart();
      }
    }
    catch(err){
      console.error("error while add-to-cart")
    }
    
  }
  return (
    <>
    <div className='min-h-screen flex justify-center bg-[#0d0d0d]'>
      <div className='grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-10 w-full max
      -w-[1600px] bg-[#0f0f0f] p-10' >
        <div>
          <img src = {product?.imageURL} alt={product?.name} className='w-full h-auto max-h-[85vh] object-contain sticky top-24 bg-[#0a0a0a]'/>
        </div>
        <div className='flex text-white flex-col mt-10'>
          <span className='lg:text-[62px] font-bold uppercase text-white tracking-tighter leading-[0.9]'>{product?.name}</span>
          <span className='font-mono text-zinc-300 text-base md:text-xl tracking-tight mt-3 lg:text-[20px]'>${product?.price}.00</span>
          <span className='text-zinc-400 text-[12px] max-w-[280px] md:mt-1 lg:mt-10'>Oversized silhouette. Heavyweight 300GSM cotton. Raw hem finish. Conceptualized for the monolithic void. Engineered for architectural layering.</span>
          <div className='flex mt-8 lg:max-w-[290px] border-b border-white/10 pb-1 w-full justify-between'>
            <span className='font-medium text-zinc-500 text-[10px] tracking-[0.1em] uppercase'>SILHOUETTE</span>
            <span className='font-bold text-white text-[10px] tracking-[0.1em] uppercase'>OVERSIZED</span>
          </div>
          <div className='flex lg:max-w-[290px] border-b border-white/10 my-3 pb-1 w-full justify-between'>
            <span className='font-medium text-zinc-500 text-[10px] tracking-[0.1em] uppercase'>FABRIC</span>
            <span className='font-bold text-white text-[10px] tracking-[0.1em] uppercase'>100% COTTON</span>
          </div>
          <div className='flex lg:w-full mt-5 pb-1 w-full justify-between  lg:mt-20'>
            <span className='font-bold text-white text-[10px] tracking-[0.1em] uppercase'>SELECT SIZE</span>
            <span className='font-medium text-zinc-500 text-[10px] tracking-[0.1em] uppercase border-b border-white/50'>SIZE GUIDE</span>
          </div>
          <div className='grid grid-cols-5 border border-white/10'>
            {["S","M","L","XL","XXL"].map((sizeNumber) => (
              
              <button key={sizeNumber} 
                disabled={!product?.sizes?.some(s => s.size === sizeNumber && s.quantity > 0)}              
                className={`p-3 border transition-all aspect-square text-[12px] uppercase relative
                  ${!product?.sizes?.some(s => s.size === sizeNumber && s.quantity > 0) 
                    ? 'opacity-50 cursor-not-allowed text-red-900 border-white/5' 
                    : selectedSize === sizeNumber 
                      ? 'border-white border-2 text-white bg-white/10 z-10' 
                      : 'border-white/10 text-zinc-500 hover:bg-white/5'
                  }`}
                onClick={() => setSelectedSize(sizeNumber)}
              >
                {sizeNumber}
              </button>
            ))}
          </div>
          <button
            onClick={(e) => addToCart(e)}
            className='bg-white text-black py-5 mt-7 hover:bg-zinc-200 transition-colors active:scale-95 active:bg-green-800'>
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              Add to cart
            </span>
          </button>
        </div>
      </div>
    </div>
    {showModal && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] font-mono">
        <div className="bg-[#0a0a0a] border border-zinc-800 p-6 w-[320px] text-center">
          <p className="text-white uppercase tracking-[0.2em] mb-6 text-[13px]">
            Item added to cart
          </p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => navigate('/cart')}
              className="bg-white text-black py-2 uppercase font-black text-[11px] hover:bg-zinc-200"
            >
              Go to Cart
            </button>
            <button 
              onClick={() => setShowModal(false)}
              className="border border-zinc-800 text-zinc-500 py-2 uppercase text-[11px] hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function LoginPage(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    try{
      const response = await fetch("https://localhost:7064/Client/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        if (response.status === 401){
          throw new Error("Password or Email is incorrect");
        }
        const errorText = await response.text(); 
        throw new Error(errorText || "Что-то пошло не так");
      }
      const data = await response.json()
      localStorage.setItem("access_token",data.accessToken)
      localStorage.setItem("refresh_token",data.refreshToken)

      console.log({"access_token": localStorage.getItem("access_token"), "refresh_token": localStorage.getItem("refresh_token")})
      navigate("/");
    }
    catch(err){
      setError(err.message)
    }
  }

  return (
    <div className='min-h-screen flex justify-center bg-[#131313] flex '>
      <div className='hidden lg:flex w-full items-start justify-center flex-col px-[5%]'>
        <h1 className="font-display text-[7vw] xl:text-[115px] font-black uppercase text-white 
               tracking-[-0.06em] leading-[0.75] ml-[-0.05em]">
          ERASERHEAD
        </h1>
        <p className='max-w-[900px] font-mono text-[11px] text-zinc-600 uppercase tracking-[0.1em] leading-relaxed mt-3'>
          The best designer clothing store in Ukraine. <br/>
          Any item from the store is free with purchase, <br/>
          provided you can prove you killed one "ТЦК" worker.
        </p> 
      </div>
      <div className='bg-black w-full lg:w-1/2 lg:max-w-[550px] lg:mr-[5%]  10 flex flex-col items-start justify-center p-16 xl:p-20'>
        <h1 className='text-white text-2xl font-medium uppercase tracking-[0.03em]'>authentication</h1>
        <p className='text-zinc-500 uppercase tracking-[0.1em] text-[10px]'>Identity Verification</p>
        <form className='flex flex-col mt-10  w-full' onSubmit={loginUser}>
          <label className="font-bold text-zinc-500 text-[9px] uppercase tracking-[0.3em] block mt-7">
            Email Address
          </label>
          <input 
            type="text" 
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent text-zinc-300 font-mono text-sm outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2"
            placeholder="user@eraserhead.com" 
          />
          <label className="font-bold text-zinc-500 text-[9px] uppercase tracking-[0.3em] block mt-7">
            password
          </label>
          <input 
            type="password" 
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent text-zinc-300 font-mono text-sm outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2"
            placeholder="•••••••••••" 
          />
          {error && (
            <span className="text-red-500 text-sm mb-2 block animate-pulse">
              {error}
            </span>
          )}
          <button className="w-full bg-white text-black py-4 uppercase font-medium tracking-[0.3em] text-xs hover:bg-zinc-200 transition-colors mt-20">
            Authenticate
          </button>
          <div className="flex justify-between items-center pt-2">
          <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-400">
            Forgot Credentials?
          </span>
          <span onClick={() => navigate(`/register`)} className="text-white text-[9px] uppercase tracking-widest font-bold border-b border-white pb-1 cursor-pointer">
            Create Account
          </span>
    </div>
        </form>
        
      </div>
    </div>
  )
}
function RegisterPage(){
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    try{
      const response = await fetch("https://localhost:7064/Client/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password })
      });
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(errorText || "Что-то пошло не так");
      }
      const data = await response.json()
      localStorage.setItem("access_token",data.accessToken)
      localStorage.setItem("refresh_token",data.refreshToken)

    console.log({"access_token": localStorage.getItem("access_token"), "refresh_token": localStorage.getItem("refresh_token")})
      navigate("/");
    }
    catch(err){
      setError(err.message)
    }
  }

  return (
    <div className='min-h-screen flex justify-center bg-[#131313] flex '>
      <div className='hidden lg:flex w-full items-start justify-center flex-col px-[5%]'>
        <h1 className="font-display text-[7vw] xl:text-[115px] font-black uppercase text-white 
               tracking-[-0.06em] leading-[0.75] ml-[-0.05em]">
          ERASERHEAD
        </h1>
        <p className='max-w-[900px] font-mono text-[11px] text-zinc-600 uppercase tracking-[0.1em] leading-relaxed mt-3'>
          The best designer clothing store in Ukraine. <br/>
          Any item from the store is free with purchase, <br/>
          provided you can prove you killed one "ТЦК" worker.
        </p> 
      </div>
      <div className='bg-black w-full lg:w-1/2 lg:max-w-[550px] lg:mr-[5%]  10 flex flex-col items-start justify-center p-16 xl:p-20'>
        <h1 className='text-white text-2xl font-medium uppercase tracking-[0.03em]'>registration</h1>
        <p className='text-zinc-500 uppercase tracking-[0.1em] text-[10px]'>Identity Verification</p>
        <form className='flex flex-col mt-10  w-full' onSubmit={registerUser}>
          <label className="font-bold text-zinc-500 text-[9px] uppercase tracking-[0.3em] block ">
            Name
          </label>
          <input 
            required
            type="text" 
            value = {name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-zinc-300 font-mono text-sm outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2"
            placeholder="Bread" 
          />
          <label className="font-bold text-zinc-500 text-[9px] uppercase tracking-[0.3em] block mt-7">
            Email Address
          </label>
          <input 
            required
            type="email" 
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent text-zinc-300 font-mono text-sm outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2"
            placeholder="user@eraserhead.com" 
          />
          <label className="font-bold text-zinc-500 text-[9px] uppercase tracking-[0.3em] block mt-7">
            password
          </label>
          <input 
            required
            type="password" 
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent text-zinc-300 font-mono text-sm outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2"
            placeholder="•••••••••••" 
          />
          {error && (
          <span className="text-red-500 text-sm mb-2 block animate-pulse">
            {error}
          </span>
)}
          <button type='submit' className="w-full bg-white text-black py-4 uppercase font-medium tracking-[0.3em] text-xs hover:bg-zinc-200 transition-colors mt-20">
            Register
          </button>
          <div className="flex justify-end items-center pt-2">
            <span onClick={() => navigate(`/login`)} className="text-white text-[9px] uppercase tracking-widest font-bold border-b border-white pb-1 cursor-pointer">
              Already have account? Login
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}




function CartPage({removeItem}){
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });


  const handleChangeCount = async (id, num) =>{
    const token = localStorage.getItem("access_token");
      if(!token) return navigate("/login")
      const response = await fetch(`https://localhost:7064/Cart/change-quantity?id=${id}&quantity=${num}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: num } : item));
        return true;
      }
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return handleChangeCount(id, num);
          }else {
            return navigate("/login");
            
          }
        }
        console.error(response.text())
      }
      return false;
      
  }

  const handleRemove = async (id) =>{
    const token = localStorage.getItem("access_token");
      if(!token) return navigate("/login")
      
      const response = await fetch(`https://localhost:7064/Cart/${id}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return handleRemove(id);
          }else {
            return navigate("/login");
          }
        }
        return;
      }
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      removeItem()
  }

  useEffect(() => {
    const fetchCart = async ()=>{
      const token = localStorage.getItem("access_token");
      if(!token) return navigate("/login")
      
      const response = await fetch("https://localhost:7064/Cart/get-cart", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchCart();
          }else {
            return navigate("/login");
          }
        }
        return;
      }
      const data = await response.json();
      setCartItems(data);
    }
    fetchCart();
  },[navigate])

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0;
  const tax = subtotal * 0.08; 
  const total = subtotal + tax;
  return(
    <>
      <div className='bg-[#0f0f0f] min-h-screen p-10'>
        <div className=''>
          <div className="flex flex-col">
            <h1 className="text-white text-[50px] font-light tracking-tighter leading-none uppercase">
              Shopping Cart
            </h1>
            <p className="text-zinc-600 text-[13px] uppercase tracking-[0.3em] mt-2 ml-1 leading-relaxed">
              Your selection of curated silhouettes
            </p>
          </div>
        </div>
        <div className='lg:flex gap-5 w-full lg:px-20 mt-5'>
          <div className='text-black p-5 flex-grow min-h-[400px]'>
            {cartItems.map((item) => (
              <div className='flex text-white my-2 border border-zinc-900 p-3 hover:border-zinc-600'>
                <div>
                  <img src={item.imageURL} className='w-[400px] '></img>
                </div>
                <div className='flex flex-col justify-between w-full'>
                  <div className='flex justify-between w-full'>
                    <div className='flex flex-col'>
                      <span className='lg:text-[7px] tracking-[0.25em] text-zinc-500 mt-1'>product id: {item.productId}</span>
                      <span className='lg:text-[20px] tracking-[0.05em] uppercase text-white' >{item?.productName}</span>
                      <span className='uppercase lg:text-[13px] font-medium text-zinc-400 mt-1'>Size: {item.size}</span>
                    </div>
                    <div>
                      <span className='text-white lg:text-[20px] m-2'>{formatter.format(item. price)}</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-6 mt-auto'>
                    <div className='flex items-center bg-black border border-zinc-800 h-9 w-min'>
                      <button onClick={() => {
                        if(item.quantity > 1) handleChangeCount(item.id, item.quantity-1) 
                      }} className='flex items-center justify-center w-9 h-full hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white border-r border-zinc-800'>
                        <span className="mb-0.5">-</span>
                      </button>
                      <span className='text-white text-[13px] px-4 font-light min-w-[40px] text-center'>
                        {item.quantity}
                      </span>
                      <button onClick={async () => {
                          const result = await handleChangeCount(item.id, item.quantity + 1);
                          if (!result) {
                            console.log("Недостаточно товара");
                          }
                        }} className='flex items-center justify-center w-9 h-full hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white border-l border-zinc-800'>
                        <span className="mb-0.5">+</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className='lg:ml-6 text-zinc-600 hover:text-red-800 text-[10px] uppercase tracking-[0.2em] transition-all duration-50 underline underline-offset-8 decoration-zinc-800 hover:decoration-red-800'
                    >
                      Remove
                    </button>
                  </div>
                  
                </div>
                
              </div>
            ))}
          </div>

          <div className='bg-[#141414] text-zinc-200 mt-7 ml-10 p-10 lg:w-[450px] h-[600px] border border-zinc-900 flex flex-col justify-between sticky top-10'>
            <div>
              <h2 className="uppercase text-[22px] tracking-[0.1em] font-medium mb-12">Order summary</h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="uppercase text-[11px] tracking-[0.15em] text-zinc-500 font-medium">Subtotal</span>
                  <span className="text-[16px] font-medium">{formatter.format(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase text-[11px] tracking-[0.15em] text-zinc-500 font-medium">Shipping</span>
                  <span className="text-[16px] font-medium">{formatter.format(shipping)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase text-[11px] tracking-[0.15em] text-zinc-500 font-medium">Tax (est.)</span>
                  <span className="text-[16px] font-medium">{formatter.format(tax)}</span>
                </div>

                <div className="border-t border-zinc-800 my-10 pt-10 flex justify-between items-baseline">
                  <span className="uppercase text-[14px] tracking-[0.2em] font-bold">Total</span>
                  <span className="text-[32px] font-bold tracking-tight">{formatter.format(total)}</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <button onClick={() => navigate("/checkout")} className="w-full bg-white text-black py-6 uppercase text-[12px] tracking-[0.3em] font-bold hover:bg-zinc-200 transition-all">
                Proceed to Checkout
              </button>
              
              <p className="text-center text-zinc-600 text-[9px] uppercase tracking-widest mt-6 leading-relaxed">
                Complimentary shipping on all seasonal drops.<br/>
                Taxes calculated at the final step.
              </p>

              <div className="flex justify-center gap-3 mt-10 h-[15px] ">
                <img src="https://deluxe.com.ua/media/img/design/icon-product-visa.png"/>
                <img src="https://deluxe.com.ua/media/img/design/icon-product-mastercard.png"/>
                <img src="https://deluxe.com.ua/media/img/design/icon-product-privat.png"/>
                <img src="https://deluxe.com.ua/media/img/design/icon-product-google.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}



function OrderPostPage({removeItem}){
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("Google Pay")
  const [adress, setAdress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [zip, setZip] = useState("")
  const [country, setCountry] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

   const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0;
  const tax = subtotal * 0.08; 
  const total = subtotal + tax;

  const fetchConfirmOrder = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    const currentOrderData = {
      phone: phoneNumber,
      firstName: firstName,
      lastName: lastName,
      country: country,
      zipCode: zip,
      streetAddress: adress,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await fetch("https://localhost:7064/Order/create_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(currentOrderData)
      });

      console.log(currentOrderData)

      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          if (isRefreshed) return fetchConfirmOrder();
          return navigate("/login");
        }
        
        navigate("/catalog")
        return;
      }

      const data = await response.json();
      console.log("Успех:", data.id);
      removeItem()
      navigate(`/сonfirmation_page/${data.id}`)

    } catch (err) {
      console.error("Network error:", err);
    }
  };

  useEffect(() => {
    const fetchCart = async ()=>{
      const token = localStorage.getItem("access_token");
      if(!token) return navigate("/login")
      
      const response = await fetch("https://localhost:7064/Cart/get-cart", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchCart();
          }else {
            return navigate("/login");
          }
        }
        const errorText = await response.text(); 
        console.error("Server Message:", errorText);
        return;
      }
      const data = await response.json();
      setCartItems(data);
    }
    fetchCart();
  },[navigate])

  return (
    <>
      <div className='bg-[#0f0f0f] min-h-screen lg:p-10 lg:px-40'>
        <div className='lg:flex justify-center'>
          <div className='m-3 text-white'>
            <div className='tracking-[0.25em] font-medium text-1xl text-zinc-300'>01. CONTACT INFO</div>
            <div className='pl-4 m-2'>
              <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>PHONE NUMBER</p>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='font-mono placeholder:text-zinc-500 appearance-none pl-2 p-0.5 bg-[#1c1c1c] outline-none decoration-none' placeholder=' ' required/>
            </div>
            <div className='tracking-[0.25em] font-medium text-1xl text-zinc-300 mt-5'>02. SHIPPING ADDRESS</div>
            <div className='pl-4 m-2'>
              <div className='flex gap-3'>
                <div>
                  <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>FIRST NAME</p>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)}className='font-mono placeholder:text-zinc-500 appearance-none pl-2 p-0.5 bg-[#1c1c1c] outline-none decoration-none' placeholder=' ' required/>
                </div>
                <div>
                  <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>LAST NAME</p>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className='font-mono placeholder:text-zinc-500 appearance-none pl-2 p-0.5 bg-[#1c1c1c] outline-none decoration-none' placeholder=' ' required/>
                </div>
              </div>
              <div className='flex gap-3 mt-3'>
                <div>
                  <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>COUNTRY, CITY</p>
                  <input value={country} onChange={(e) => setCountry(e.target.value)} className='w-[350px] font-mono placeholder:text-zinc-500 appearance-none pl-2 p-0.5 bg-[#1c1c1c] outline-none decoration-none' placeholder=' ' required/>
                </div>
                <div>
                  <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>ZIP</p>
                  <input value={zip} onChange={(e) => setZip(e.target.value)} type="text"  className='w-[50px] font-mono placeholder:text-zinc-500 appearance-none pl-2 p-0.5 bg-[#1c1c1c] outline-none decoration-none' placeholder=' ' required/>
                </div>
              </div>
              <div className='mt-3'>
                  <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>STREET ADRESS</p>
                  <input value={adress} onChange={(e) => setAdress(e.target.value)} type="text"className='w-[410px] font-mono placeholder:text-zinc-500 appearance-none pl-2 p-0.5 bg-[#1c1c1c] outline-none decoration-none' placeholder=' ' required/>
              </div>
            </div>
            <div className='tracking-[0.25em] font-medium text-1xl text-zinc-300 mt-5'>03. PAYMENT METHOD</div>
            <div className='pl-4 m-2 max-w-[410px]'>
              <p className='text-zinc-500 uppercase tracking-[0.15em] font-medium text-[11px] mb-1'>PAYMENT METHOD</p>
              <div className='flex flex-col text-white mr-[60px]'>
                <select onChange={(e) => setPaymentMethod(e.target.value)} className='bg-black text-white w-[410px] p-1 outline-none font-bold text-[15px] tracking-wide cursor-pointer bg-[#1c1c1c]'
                  >
                  <option value="Google Pay">Google Pay</option>
                  <option value="Visa">Visa</option>
                  <option value="Privat24">Privat24</option>
                  <option value="Mastercard">Mastercard</option>
                </select>
              </div>
            </div>
          </div>
          <div className='bg-[#141414] text-zinc-200 ml-10 p-10 lg:w-[450px] border border-zinc-900 flex flex-col justify-between sticky top-10'>
            <div>
              <h2 className="uppercase text-[22px] tracking-[0.1em] font-medium mb-12">Order summary</h2>

              <div className="space-y-6">
                <div>
                  {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="group flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-white whitespace-nowrap">
                        {item.productName}
                      </span>
                      <div className="h-[1px] w-full border-b border-dashed border-white/10 mb-[3px] group-hover:border-white/30 transition-colors"></div>
                      <span className="text-[12px] font-mono text-white whitespace-nowrap">
                        {formatter.format(item.quantity * item.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                      <div className="flex gap-4">
                        <span>SIZE: {item.size}</span>
                        <span>QTY: {item.quantity}</span>
                      </div>
                      <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                        UNIT_PRICE: {formatter.format(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
                </div>
                <div className="border-t border-white/10 w-full mt-5"></div>
                <div className="flex justify-between items-center">
                  <span className="uppercase text-[11px] tracking-[0.15em] text-zinc-500 font-medium">Subtotal</span>
                  <span className="text-[16px] font-medium">{formatter.format(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase text-[11px] tracking-[0.15em] text-zinc-500 font-medium">Shipping</span>
                  <span className="text-[16px] font-medium">{formatter.format(shipping)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase text-[11px] tracking-[0.15em] text-zinc-500 font-medium">Tax (est.)</span>
                  <span className="text-[16px] font-medium">{formatter.format(tax)}</span>
                </div>

                <div className="border-t border-zinc-800 my-10 pt-10 flex justify-between items-baseline">
                  <span className="uppercase text-[14px] tracking-[0.2em] font-bold">Total</span>
                  <span className="text-[32px] font-bold tracking-tight">{formatter.format(total)}</span>
                </div>
              </div>
            </div>

            <div className="w-full mt-5">
              <button onClick={fetchConfirmOrder} className="w-full bg-white text-black py-6 uppercase text-[12px] tracking-[0.3em] font-bold hover:bg-zinc-200 transition-all">
                CONFIRM ORDER
              </button>
              
              <p className="text-center text-zinc-600 text-[9px] uppercase tracking-widest mt-6 leading-relaxed">
                Complimentary shipping on all seasonal drops.<br/>
                Taxes calculated at the final step.
              </p>

              <div className="flex justify-center gap-3 mt-10 h-[15px] ">
                <img src="https://deluxe.com.ua/media/img/design/icon-product-visa.png"/>
                <img src="https://deluxe.com.ua/media/img/design/icon-product-mastercard.png"/>
                <img src="https://deluxe.com.ua/media/img/design/icon-product-privat.png"/>
                <img src="https://deluxe.com.ua/media/img/design/icon-product-google.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ConfirmationPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const SuccessIcon = () => {
    return (
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute w-40 h-40 border border-zinc-800 rotate-[30deg]"></div>
        <div className="absolute w-40 h-40 border border-zinc-700 rotate-[15deg]"></div>
        <div className="absolute w-40 h-40 border border-zinc-500 bg-[#0d0d0d] flex items-center justify-center">
          <svg 
            width="34" 
            height="34" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className='w-full flex justify-center bg-black min-h-screen font-mono'>
      <div className='flex flex-col items-center justify-center w-full max-w-2xl px-6'>
        
        <SuccessIcon />

        <p className='mt-14 font-black tracking-[0.2em] text-white text-3xl uppercase'>
          ORDER<span className='text-zinc-600'>#{id?.padStart(6, '0')}</span> ACCEPTED
        </p>

        <div className='mt-3 w-full max-w-md text-center'>
          <p className='text-zinc-500 text-xs uppercase tracking-widest leading-relaxed'>
            Your archival acquisition has been successfully logged. 
            <br />
            Preparation for shipment has initiated.
          </p>
        </div>
        <button 
          onClick={() => navigate("/catalog")}
          className='bg-white text-black py-5 px-10 mt-7 hover:bg-zinc-200 transition-colors active:scale-95 active:bg-green-800'>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            Go shopping
          </span>
        </button>
      </div>
    </div>
  )
}

const ProfilePage = ({updateCart}) => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async ()=>{
      const token = localStorage.getItem("access_token");
      if(!token) return navigate("/login")
      
      const response = await fetch("https://localhost:7064/Client/me", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchMe();
          }else {
            return navigate("/login");
          }
        }
        const errorText = await response.text(); 
        console.error("Server Message:", errorText);
        return;
      }
      const data = await response.json();
      setUser(data);
    }

    const fetchOrders = async ()=>{
      const token = localStorage.getItem("access_token");
      if(!token) return navigate("/login")
      
      const response = await fetch("https://localhost:7064/Order/getOrders", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchOrders();
          }else {
            return navigate("/login");
          }
        }
        const errorText = await response.text(); 
        console.error("Server Message:", errorText);
        return;
      }
      const data = await response.json();
      setOrders(data);
    }



    
    fetchMe();
    fetchOrders()
  },[navigate])

  const logOut = async () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    navigate("/")
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-mono p-8 flex flex-col items-center">
      <div className='w-full flex flex-col items-center pt-2 pb-12 bg-black'>
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center border border-zinc-700">
            <div className="text-zinc-500 text-xs uppercase tracking-widest"><img src='https://i.ibb.co/Gf07hyRL/photo-2026-03-31-20-27-30-1.jpg'/></div>
          </div>
          <div className='mt-5 text-center'>
              <h1 className='font-black tracking-[0.2em] text-white text-5xl uppercase mb-4'>
                  HI, {user.name || "DANYLO"}
              </h1>
              <div className='flex flex-col items-center gap-2'>
                  <p className='font-mono uppercase tracking-[0.4em] text-zinc-500 text-[11px]'>
                      email: <span className='text-zinc-300'>{user.email}</span>
                  </p>
                  <p className='font-mono uppercase tracking-[0.4em] text-zinc-700 text-[9px]'>
                      role: {user.role}
                  </p>
              </div>
          </div>
          <div className='flex mt-10'>
            <button onClick={() => logOut()} className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-300 border-b border-zinc-900 text-left">Log out</button>
          {user?.role === "Admin" && (
            <button 
              onClick={() => navigate('/admin')} 
              className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-300 border-b border-zinc-900 text-left"
            >
              Admin Panel
            </button>
          )}
          </div>
          
      </div>
      
      
      <div className="w-full max-w-4xl">
        <h2 className="text-xs tracking-[0.5em] text-zinc-500 uppercase mb-6 border-b border-zinc-900 pb-2">
          Your orders
        </h2>

        <div className="flex flex-col gap-4">
          {orders.length > 0 ? orders.map(order => (
            <div key={order.id} className="border border-zinc-900 p-6 flex justify-between items-center hover:bg-[#111] transition-all">
              <div>
                <span className="text-cyan-500 font-bold block mb-1">#{order.id.toString().padStart(6, '0')}</span>
                <span className="text-[10px] text-zinc-600 uppercase">{order.date}</span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold tracking-tighter">{formatter.format(order.totalSum)}</span>
                <span className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-400 uppercase tracking-tighter">
                  {order.status}
                </span>
              </div>
            </div>
          )) : (
            <p className="text-[10px] text-zinc-800 uppercase tracking-[0.3em] text-center mt-10">
              You dont have orders yet

            </p>
          )}
        </div>
      </div>

    </div>
  );
};


const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [page, pageSize, token, navigate]);



  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://localhost:7064/Order/getAllOrders?page=${page}&pageSize=${pageSize}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.items);
        setTotalPages(data.totalPages);
        console.log("Данные получены:", data.items);
      }else{
        if (res.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchOrders();
          }else {
            return navigate("/login");
          }
        }
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    await fetch(`https://localhost:7064/Admin/update-status?id=${orderId}&status=${newStatus}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchOrders(); 
  };

  

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-5 ">
      <h1 className="text-white text-1xl font-black tracking-[0.5em] uppercase mb-10 border-b border-zinc-900 pb-4">
        VOID_CONTROL // ORDERS
      </h1>

      <div className='w-full flex items-center justify-center'>
        <div className="w-1/2 border border-zinc-900 overflow-hidden ">
          <div className="flex justify-between items-center border-t border-zinc-900 p-4 text-[9px] text-zinc-500">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="hover:text-white uppercase tracking-widest">Prev</button>
              <span className='text-zinc-300 font-mono text-sm'>
                <input 
                className='w-[50px] bg-transparent  outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2' 
                value={page} 
                onChange={(e) => setPage(parseInt(e.target.value))} /> / {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="hover:text-white uppercase tracking-widest">Next</button>
          </div>
          <table className="w-full text-left text-[11px] uppercase tracking-tighter">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[14px] tracking-widest">
                <th className="p-4">ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-white divide-y divide-zinc-900 text-[15px]">
              {orders.map((order) => (
                <tr onClick={() => navigate(`/admin/order/${order.id}`)} key={order.id} className=' hover:bg-zinc-900 cursor-pointer transition-all'>
                  <td className="p-4 text-zinc-500">#{order.id}</td>
                  <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    {order.items.map(item => (
                      <div key={`${order.id}-${item.productId}-${item.size}`} className="text-[10px]">
                        {item.productName} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-4 font-bold">{order.totalSum} USD</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 ${
                      order.status === 'Completed' ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
      
  );
};

function OrderDetail(){
  const { id } = useParams(); 
  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const fetchOrder = async () => {
    const token = localStorage.getItem("access_token");
    if(!token) return navigate("/login")
    try {
      const response = await fetch(`https://localhost:7064/Order/getOrderById/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchOrder();
          }else {
            return navigate("/login");
          }
        }
        const errorText = await response.text(); 
        console.error("Server Message:", errorText);
        return;
      }

      const data = await response.json();
      console.log(data);
      setOrder(data);
      setProducts(data.products)

      
    } catch (err) {
      console.error("Ошибка сети:", err);
    }
  }


  useEffect(() => {
    if (id) {
    fetchOrder();
  }
  },[id])

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-5">
        <h1 className="text-white text-1xl font-black tracking-[0.5em] uppercase mb-10 border-b border-zinc-900 pb-4">
          VOID_CONTROL // <Link to="/admin">ORDERS</Link> // ORDER#{id}
        </h1>
        <div className='w-full flex justify-center '>
          <div className='w-1/2 min-h-screen flex'>
            <div className="w-full">
              {products.map((item) => (
                <div key={item.id} className='flex text-white my-2 border border-zinc-900 p-3 hover:border-zinc-600'>
                  <div>
                    <img src={item.product?.imageURL} className='w-[200px] '></img>
                  </div>
                  <div className='flex flex-col justify-between w-full'>
                    <div className='flex justify-between w-full'>
                      <div className='flex flex-col'>
                        <span className='lg:text-[7px] tracking-[0.25em] text-zinc-500 mt-1'>product id: {item.productId}</span>
                        <span className='lg:text-[20px] tracking-[0.05em] uppercase text-white cursor-pointer' onClick={() => navigate(`/product/${item.productId}`)}>{item.product?.name}</span>
                        <span className='uppercase lg:text-[13px] font-medium text-zinc-400 mt-1'>Size: {item.size}</span>
                        <p className='uppercase lg:text-[13px] font-medium text-zinc-400'>QTY: {item.quantity}</p>
                        <p className='text-white lg:text-[15px]'>{formatter.format(item.price)}</p>
                      </div>
                      <div className='felx flex-col'>
                        <p className='text-white lg:text-[20px] text-end m-2'>{formatter.format(item.price*item.quantity)}</p>
                      </div>
                    </div>
                    
                  </div>
                  
                </div>
              ))}
            </div>
            <div className='sticky top-20'>
              <div className='p-6 border border-zinc-900 mt-2 mx-2 h-min py-10 '>
                <div className='text-zinc-300 border-b border-zinc-900 mb-5 pb-5'>
                  <p className='text-zinc-500 tracking-[0.2em] mb-3'>SHIPPING_ADDRESS</p>
                  <div className='pl-3'>
                    <p>{order?.country}</p>
                    <p>{order?.streetAddress}</p>
                    <p>{order?.zipCode}</p>
                  </div>
                </div>
                <div className='text-zinc-300'>
                  <p className='text-zinc-500 tracking-[0.2em] mb-3'>CONTACT_INFO</p>
                  <div className='pl-3'>
                    <p className='text-white font-black'>{order?.firstName} {order?.lastName}</p>
                    <p>{order?.phone}</p>
                    <p>{order?.client?.email}</p>
                  </div>
                </div>
              </div>
              <div className=' bg-[#1b1b1b] mx-2 py-6 px-5 w-[300px]'>
                <div className='flex justify-between'>
                  <span>SUBTOTAL</span>
                  <span className='text-zinc-300'>{formatter.format(order.sum)}</span>
                </div>
                <div className='flex justify-between mt-1 border-b border-zinc-600 pb-2 mb-2'>
                  <span className='uppercase'>Payment method</span>
                  <span className='text-zinc-300'>{order.paymentMethod}</span>
                </div>
                <div className='flex justify-between mt-1 items-end'>
                  <span className='uppercase'>Total</span>
                  <span className='text-zinc-300 text-2xl'>{formatter.format(order.sum)}</span>
                </div>
              </div>
              <div className='flex justify-center items-center uppercase text-black text-2xl font-black bg-white px-10 py-3 mx-2 '>
                <h1>{order.status}</h1>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </>
  )
}


function ChangeProduct(){
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [productId, setProductId] = useState(0)

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageURL: ''
  });


  const fetchChangeProduct = async () => {
    const token = localStorage.getItem("access_token");
    if(!token) return navigate("/login")
    try {
      const response = await fetch(`https://localhost:7064/Product/change/${id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product) 
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchChangeProduct();
          }else {
            return navigate("/login");
          }
        }
        const errorText = await response.text(); 
        console.error("Server Message:", errorText);
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error("Ошибка сети:", err);
    }
  }

  const fetchProduct = async () => {
    const token = localStorage.getItem("access_token");
    if(!token) return navigate("/login")
    try {
      const response = await fetch(`https://localhost:7064/Product/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) {
          const isRefreshed = await refreshTokens();
          
          if (isRefreshed) {
            return fetchProduct();
          }else {
            return navigate("/login");
          }
        }
        const errorText = await response.text(); 
        console.error("Server Message:", errorText);
        return;
      }

      const data = await response.json();
      console.log(data);
      setProduct(data)

      
    } catch (err) {
      console.error("Ошибка сети:", err);
    }
  }


  useEffect(() => {
    if (id) {
      setProductId(id)
      fetchProduct();
    }
  },[id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) : value 
    }));
  };

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-5">
        <h1 className="text-white text-1xl font-black tracking-[0.5em] uppercase mb-10 border-b border-zinc-900 pb-4">
          VOID_CONTROL // <Link to="/admin">Products</Link> // product#{id}
        </h1>
        <div className='w-full max-h-screen'>
          <div className='border-b border-zinc-700 flex items-center h-[50px]'>
            <p className='text-zinc-200 tracking-[0.2em]'>PRODUCT_ID:</p>
            <input 
            value={productId}
            type='number'
            onChange={(e) => setProductId(e.target.value)}
            className="bg-transparent text-zinc-300 font-mono text-sm outline-none placeholder:text-zinc-700 border-b border-zinc-700 p-2"/>
            <button className='' onClick={() => navigate(`/admin/change-product/${productId}`)}>Send</button>
          </div>
        </div>
        <div className='w-full max-h-screen'>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Entry_Name</label>
            <input 
              name="name"
              value={product.name}
              onChange={handleChange}
              className="bg-transparent border-b border-zinc-800 text-white p-2 outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-2">
              <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Price_USD</label>
              <input 
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                className="bg-transparent border-b border-zinc-800 text-white p-2 outline-none focus:border-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Category_Tag</label>
              <input 
                name="category"
                value={product.category}
                onChange={handleChange}
                className="bg-transparent border-b border-zinc-800 text-white p-2 outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Source_Image_URL</label>
              <input 
                name="imageURL"
                value={product.imageURL}
                onChange={handleChange}
                className="bg-transparent border-b border-zinc-800 text-zinc-400 p-2 text-xs outline-none focus:border-white transition-colors"
              />
              <img className="max-w-[150px]" src={product.imageURL}/>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Data_Description</label>
            <textarea 
              name="description"
              rows="4"
              value={product.description}
              className="bg-transparent border border-zinc-900 text-white p-3 text-sm outline-none focus:border-zinc-500 transition-colors resize-none"
            />
          </div>
          <button onClick={() => fetchChangeProduct()} className='bg-white text-black font-black uppercase p-2 hover:bg-zinc-500 transition-colors mt-10'>Save changes</button>
        </div>
      </div>
    </>
  )
}



function ErrorPage(){
  return(
    <div className='min-h-screen w-full flex justify-center items-center bg-black text-white'>
      PAGE NOT FOUND
    </div>
  )
}

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const handleUpdateCart = async () => {
    await setCartItemsCount(prev => prev - 1);
  };
  const handleRemoveCart = async () => {
    await setCartItemsCount(0);
  };
  const getCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
          const response = await fetch("https://localhost:7064/Cart/get-cartItem-count", {
            method: "GET", 
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json(); 
            setCartItemsCount(Number(data));
          }
          if (!response.ok) {
          if (response.status === 401) {
            const isRefreshed = await refreshTokens();
            
            if (isRefreshed) {
              return getCount();
            }
          }
          const errorText = await response.text(); 
          throw new Error(errorText || "Что-то пошло не так");
        }
        } catch (error) {
          console.error("Ошибка при получении корзины:", error);
        }
      };
  useEffect(() => {
    getCount();
  }, []);

  
  return (
    
    <BrowserRouter>
      <Header cartCount={cartItemsCount} />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/catalog' element={<Catalog/>}/>
        <Route path='/product/:id' element={<ProductPage updateCart={getCount}/> }/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/checkout' element={<OrderPostPage  removeItem={handleRemoveCart}/>}/>
        <Route path='/cart' element={<CartPage removeItem={handleUpdateCart}/>}/>
        <Route path='/сonfirmation_page/:id' element={<ConfirmationPage/>}/>
        <Route path='/profile' element={<ProfilePage updateCart={handleRemoveCart}/>}/>
        <Route path='/admin' element={<AdminPanel />} />
        <Route path="/admin/order/:id" element={<OrderDetail />} />
        <Route path="/admin/change-product/:id" element={<ChangeProduct />} />
        <Route path='*' element={<ErrorPage/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;