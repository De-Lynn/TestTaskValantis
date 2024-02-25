const SearchForm = ({onFormSubmit}) => {
    return (
        <div className='app__form form__wrapper'>
            <select className='form__params' name='param' form='searchForm'>
                <option className='param__item'>Brand</option>
                <option className='param__item'>Product</option>
                <option className='param__item'>Price</option>
            </select>
            <form className='form' id='searchForm' onSubmit={onFormSubmit}>
                <input className='form__input' name='value'></input>
                <button className='form__button button__submit' type='submit'>Search</button>
            </form>
        </div>
    )
}

export default SearchForm