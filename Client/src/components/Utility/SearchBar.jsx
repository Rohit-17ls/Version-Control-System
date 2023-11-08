import React, { useCallback, useRef } from 'react'
import Input from '../Core/Input'

const SearchBar = ({value, setValue, searchHandler, searchResults, waitPeriod}) => {

    const timeoutRef = useRef(null);



    const handler = useCallback((searchValue) => {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);

        setValue(searchValue);
        timeoutRef.current = setTimeout(() => {
            searchHandler(searchValue);
        }, waitPeriod);

    })

  return (
    <div className='mb-5'>
        <Input name="search-developer"
               placeholder="Search for developers"
               className=''
               value={value}
               changeHandler={(e) => {handler(e.target.value)}}/>
        <ul className='pb-1 bg-hover rounded-b-lg'>
            {searchResults.map((result, ind) => <li key={ind} className='px-2 pt-1 bg-hover hover:brightness-125 hover:cursor-pointer'>{result}</li>)}
        </ul>

    </div>
  )
}

export default SearchBar