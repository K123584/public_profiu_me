import React from 'react'
import { RenderLeafProps } from 'slate-react';

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    let style: React.CSSProperties = {};
  
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
  
    if (leaf.code) {
      children = <code>{children}</code>
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>
    }
  
    if (leaf.underline) {
      children = <u>{children}</u>
    }
  
    if (leaf.color) {
      style.color = leaf.color;
    }
  
    return (
      <span {...attributes} style={style}>
        {children}
      </span>
    )
  }

export default Leaf