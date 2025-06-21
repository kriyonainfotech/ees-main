const RequestTabs = ({ currentTab, setCurrentTab }) => {
    const tabs = ["Sended Request", "Received Request"];

    return (
        <div className="flex gap-3 sticky top-0 z-10 p-4 bg-white shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`btn rounded-lg ${currentTab === tab ? "btn-success text-white" : "bg-none border-black text-black"}`}
                    onClick={() => setCurrentTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default RequestTabs;
