"use client";
import {useRef} from "react";

interface Props {label:string;items:Array<{id:string;title:string}>}
export default function FeatureNavigation({label,items}:Props) {
  const disclosure=useRef<HTMLDetailsElement>(null);
  const links=(close=false)=><ul>{items.map(item=><li key={item.id}><a href={`#${item.id}`} onClick={close?()=>{if(disclosure.current)disclosure.current.open=false;}:undefined}>{item.title}</a></li>)}</ul>;
  return <aside className="feature-navigation">
    <nav className="feature-navigation__desktop" aria-label={label}><p>{label}</p>{links()}</nav>
    <details className="feature-navigation__mobile" ref={disclosure}><summary>{label}<span aria-hidden="true">{items.length}</span></summary><nav aria-label={label}>{links(true)}</nav></details>
  </aside>;
}
