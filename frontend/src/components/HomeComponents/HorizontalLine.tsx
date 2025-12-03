import { CSSProperties } from "react";

interface PropsType {
  style?: CSSProperties;
}

const HorizontalLine = (props: PropsType) => {
  /** DefaultStyle: グレーの縦線 */
  const defaultStyle = {
    width: "95%" /* 横線の幅を設定する => Defaultは、横幅いっぱいのStyle */,
    height: "1px" /* 横線の太さを設定する */,
    marginLeft: "auto" /* 左側の余白を自動で設定 */,
    marginRight: "auto" /* 右側の余白を自動で設定 */,
    marginBottom: "30px" /* 下側の余白を設定 */,
    backgroundColor: "#AFAEB3" /* 横線の色を指定 */,
  } as CSSProperties;

  return <div style={props.style ? props.style : defaultStyle}></div>;
};

export default HorizontalLine;