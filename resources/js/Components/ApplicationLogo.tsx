import { SVGAttributes } from "react";

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    const { className, style } = props;

    return (
        <img
            src="/images/logo-tdi.png"
            alt="Application Logo"
            className={className}
            style={style}
            width={100}
        />
    );
}
