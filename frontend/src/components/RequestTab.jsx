import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RequestTab = () => {
    const location = useLocation();

    // Determine the active tab based on the current URL
    const currentRequest = location.pathname.includes('recievedrequest')
        ? 'Received Request'
        : 'Sended Request';

    const requests = [
        { id: 1, name: 'Sended Request', path: '/work' },
        { id: 2, name: 'Received Request', path: '/work/recievedrequest' },
    ];

    return (
        <div>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex gap-3">
                            {requests.map((req) => (
                                <div key={req.id} className="receivReqBtn">
                                    <Link
                                        to={req.path} // Navigate to respective route
                                        className={`btn rounded-0 text-white ${currentRequest === req.name ? 'btn-success' : 'bg-green-100'}`}
                                    >
                                        {req.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RequestTab;
