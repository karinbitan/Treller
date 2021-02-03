import { Link, useLocation } from "react-router-dom";

import './CardPreview.scss';

export function CardPreview({ card }) {
    const location = useLocation();
    return (
        <section>
            <h1>111</h1>
            <Link to={{
                pathname: `/treller/card/${card._id}`,
                state: { background: location }
            }}>{card.title}</Link>
        </section>
    )
}