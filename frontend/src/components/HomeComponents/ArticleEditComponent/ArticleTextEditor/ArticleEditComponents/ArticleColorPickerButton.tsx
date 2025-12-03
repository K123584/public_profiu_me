import { useState } from "react"
import { useSlate } from "slate-react"
import { toggleColorMark } from "../ArticleContentEditor"


const ArticleColorPickerButton = () => {
    const editor = useSlate()
    const [color, setColor] = useState("#000000")
  
    const handleChange = (e) => {
      const newColor = e.target.value
      setColor(newColor)
      toggleColorMark(editor, newColor)
    }
  
    return (
      <input
        type="color"
        value={color}
        onChange={handleChange}
        style={{ marginLeft: '8px' }}
      />
    )
  }

export default ArticleColorPickerButton