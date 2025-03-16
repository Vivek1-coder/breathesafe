
"use client";

import './card3.css'
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Trash2, View } from 'lucide-react';
import { useEffect, useState } from 'react';


export function PyqCard({id,location}) {


  

  return (
    <div className='h-16 w-52 flex items-center justify-between px-2 rounded-2xl gap-2 card border  text-white' >
  
      <a href={`http://drive.google.com/file/d/${content}/view`} target='_blank' >
        <button className='text-blue-500 flex justify-center'>
            <View/>
        </button>
        </a>
        <div className='flex flex-col justify-center w-1/2 h-24 text-center'>
        
        <p className='font-bold text-xl overflow-y-auto '>{title}</p>
       
        
        </div>
       
        {!isPublic && !loading && (
          <button
            onClick={handleDelete}
            className=" text-red-500 rounded-lg flex justify-center "
          >
            <Trash2 />
          </button>
        )}
    </div> 
  );
}
