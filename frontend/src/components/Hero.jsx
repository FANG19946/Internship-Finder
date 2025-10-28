import React from 'react'

export default function Hero() {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2   bg-white/80 backdrop-blur-md shadow " >
                <div className=" h-screen flex flex-col items-center justify-center m-10">
                    <h1 className='font-bold  text-black'>Find <span className='text-blue-500'>Internships</span> and <span className='text-blue-500'>Scholarships</span> Tailored to <span className='text-blue-500'>You</span></h1>

                    <div className="w-full  text-left mt-10">
                        <button
                            onClick={() => window.location.href = "http://localhost:5000/api/auth/github"}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
                        >
                            Login with GitHub
                        </button>

                    </div>
                    <img src="/magnifying-glass.png" className='w-40 mt-5' alt="Magnifying Glass Image" />
                    <a className='hidden' href="https://www.vecteezy.com/free-png/magnifying-glass">Magnifying Glass PNGs by Vecteezy</a>


                </div>
                <div className=" h-screen overflow-hidden">

                    <img src="/doctor.png" className='h-3/4' alt="Doctor Image" />
                    <a className='hidden' href="https://www.vecteezy.com/free-png/doctor">Doctor PNGs by Vecteezy</a>
                    <img src="/engineer.png" className='h-1/3 w-auto  absolute right-0 bottom-0 md:w-1/3 md:h-auto' alt="Engineer Image" />
                    <a className='hidden ' href="https://www.vecteezy.com/free-png/engineer">Engineer PNGs by Vecteezy</a>

                </div>
            </div>
        </div>
    )
}
