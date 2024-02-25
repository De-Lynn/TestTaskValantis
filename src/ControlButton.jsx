const ControlButton = ({onClick, text, className = 'pages__control'}) => {
    return (
        <button className={className} onClick={onClick}>{text}</button>
    )
}

export default ControlButton