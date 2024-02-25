const PageNumber = ({currentPage, index, onPageClick}) => {
    return (
        <span className={'pages__number ' + (currentPage === index+1 ? 'active' : '')} key={index} onClick={onPageClick}>
            {index + 1}
        </span>
    )
}

export default PageNumber