'use client'

import Link from "next/link";
import { nodes } from "./linkSidebar";
import { FiChevronRight } from "react-icons/fi";
import { useState } from "react";

type Node = {
    name: string;
    url: string;
    nodes?: Node[];
    icon?: JSX.Element;
};

export default function Sidebar({
    isOpen,
    toggleSidebar,
}: {
    isOpen: boolean;
    toggleSidebar: () => void;
}) {
    return (
        <div
            className={`fixed top-0 bottom-0 left-0 w-64 p-2 mt-[65px] max-h-full overflow-y-scroll shadow-md custom-scrollbar bg-white transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
        >
            <ul>
                {nodes.map((node) => (
                    <FilesystemItem
                        node={node}
                        key={node.name}
                        toggleSidebar={toggleSidebar}
                    />
                ))}
            </ul>
        </div>
    );
}

function FilesystemItem({
    node,
    toggleSidebar,
}: {
    node: Node;
    toggleSidebar: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        // e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <li className="mb-4">
            <div className="flex justify-between items-center hover:text-orange-500 rounded-md cursor-pointer">
                <Link href={node.url} onClick={() => {
                    if (window.innerWidth < 768) toggleSidebar();
                }}>
                    <span onClick={handleToggle} className="flex items-center gap-3 text-[14px] font-medium pl-5">
                        {node.icon}
                        <span onClick={handleToggle} className="text-[15px]  font-medium">{node.name}</span>
                    </span>
                </Link>
                {node.nodes && node.nodes.length > 0 && (
                    <button onClick={handleToggle} className="p-1 -ml-1">
                        <FiChevronRight
                            className={`size-4 text-gray-500 hover:text-orange-500 ${isOpen ? "rotate-90" : ""
                                }`}
                        />
                    </button>
                )}

            </div>
            <div
                className={`overflow-hidden transition-max-height duration-1000 ease-in-out`}
                style={{
                    maxHeight: isOpen && node.nodes ? `${node.nodes.length * 40}px` : "0px",
                }}
            >
                {/* <ul className="pl-[26px] mt-3 text-[12px] text-gray-600 font-light"> */}
                <ul className=" mt-3 text-[12px] text-gray-600 font-light">
                    {node.nodes?.map((childNode) => (
                        <FilesystemItem
                            node={childNode}
                            key={childNode.name}
                            toggleSidebar={toggleSidebar}
                        />
                    ))}
                </ul>
            </div>

        </li>
    );

}




