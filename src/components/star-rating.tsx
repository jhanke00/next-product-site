interface StarIconProps {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
  strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
}

function StarRating(props: StarIconProps) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || 24}
      height={props.height || 24}
      viewBox='0 0 24 24'
      fill={props.fill || 'none'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth={props.strokeWidth || 0}
      strokeLinecap={props.strokeLinecap || 'round'}
      strokeLinejoin={props.strokeLinejoin || 'round'}
    >
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
}

export default StarRating;
