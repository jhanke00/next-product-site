function Checkbox({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) {
  return <input type='checkbox' checked={checked} onChange={onCheckedChange} />;
}

export default Checkbox;
