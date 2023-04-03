import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from "./router";
import Query from "./services/query";
import Auth from "./services/auth/Auth";
import Theme from "./theme";
import {OverlayLoader} from "./components/loader";
import './services/i18n'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.Suspense fallback={<OverlayLoader/>}>
        <Query>
            <Auth>
                <Theme>
                    <Router/>
                </Theme>
            </Auth>
        </Query>
    </React.Suspense>
);

