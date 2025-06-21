import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../UserContext";
import { backend_API, requestPriority } from "../../utils/constants";

const useRequestFetcher = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const { user } = useContext(UserContext);
    const [sendedRequest, setSendedRequest] = useState([]);
    const [receivedRequest, setReceivedRequest] = useState([]);
    const [currentTab, setCurrentTab] = useState(localStorage.getItem("currentRequest") || "Sended Request");
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        if (!token) return toast.error("Authentication required");

        const endpoint = currentTab === "Sended Request"
            ? `${backend_API}/request/getSentRequests`
            : `${backend_API}/request/getReceivedRequests`;

        setLoading(true);

        try {
            const { data, status } = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (status === 200) {
                const rawRequests = currentTab === "Sended Request" ? data.sendedRequests : data.receivedRequests;

                const sorted = rawRequests.sort((a, b) => {
                    const aPriority = requestPriority[a.status] || 99;
                    const bPriority = requestPriority[b.status] || 99;
                    return aPriority !== bPriority
                        ? aPriority - bPriority
                        : new Date(b.date) - new Date(a.date);
                });

                currentTab === "Sended Request"
                    ? setSendedRequest(sorted)
                    : setReceivedRequest(sorted);
            }
        } catch (err) {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    }, [currentTab]);

    useEffect(() => {
        fetchRequests();
    }, [currentTab]);

    useEffect(() => {
        localStorage.setItem("currentRequest", currentTab);
    }, [currentTab]);

    return {
        user,
        loading,
        currentTab,
        setCurrentTab,
        sendedRequest,
        receivedRequest,
    };
};

export default useRequestFetcher;
