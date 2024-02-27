const GoodsList = ({goods, currentPage, itemsPerPage}) => {
    return (
        <div className='results__items'>
            {goods.slice(currentPage * itemsPerPage - itemsPerPage, currentPage * itemsPerPage)
            .map(el => <div className='item' key={el.id}>
                    <div className='item__param name'>{el.product}</div>
                    <div className='item__param brand'>{el.brand}</div>
                    <div className='item__bottom'>
                        <div className='item__param id'>{el.id}</div>
                        <div className='item__param price'>{el.price}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GoodsList