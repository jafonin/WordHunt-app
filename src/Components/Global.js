import React from 'react'

export default function Global() {
    const [searchValue, setSearchValue] = React.useState('');

    const updateSearch = (searchValue) => {
        setSearchValue(searchValue);
    };
  return (
    <></>
  )
}
