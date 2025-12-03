import { useState } from "react"
import { SketchPicker } from "react-color"
import { useSlate } from "slate-react"
import { toggleColorMark } from "../OptionItemEditor"


const ColorPickerButton = () => {
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

export default ColorPickerButton