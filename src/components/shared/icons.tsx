import React from "react";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as HiIcons2 from "react-icons/hi2";
import * as BsIcons from "react-icons/bs";
import * as IO5 from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import * as VCS from "react-icons/vsc";
import * as IoIcons from "react-icons/io"
import * as AiIcons from "react-icons/ai"
import * as Io5Icons from "react-icons/io5";

// import { IoDownloadOutline } from "react-icons/io5";


import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/gi";
import * as FiIcons from "react-icons/fi";
import * as MdIcons from "react-icons/md";
import * as TiIcons from "react-icons/ti";
import * as PiIcons from "react-icons/pi";

// PiDotOutlineFill
// import * as CgIcons from "react-icons/cg"

type Props = {
    iconName?: string;
    iconclasses?: string[];
    text?: string;
    textClasses?: string[];
    divClasses?: string[];
    onClick?: () => void;
};

const RdIcon = (props: Props) => {
    const getIcon = (_style: string) => {
        switch (props.iconName) {
            case "dot":
                return <PiIcons.PiDotOutlineFill className={_style} />;
            case "download":
                return <Io5Icons.IoDownloadOutline className={_style} />;
            case "profile":
                return <RiIcons.RiAccountCircleFill className={_style} />;
            case "academic-cap":
                return <HiIcons2.HiOutlineAcademicCap className={_style} />;
            case "apps":
                return <IO5.IoApps className={_style} />;
            case "arrowdropleft":
                return <FiIcons.FiArrowLeft className={_style} />;
            case "arrowdropright":
                return <FiIcons.FiArrowRight className={_style} />;
            case "close-submenu":
                return <FiIcons.FiMenu className={_style} />;
            case "bar4":
                return <HiIcons2.HiOutlineBars4 className={_style} />;
            case "backPage":
                return <IoIcons.IoMdArrowRoundBack className={_style} />;
            case "open-eye":
                return <IoIcons.IoMdEye className={_style} />;
            case "eye-off":
                return <IoIcons.IoMdEyeOff className={_style} />;


            case "bars":
                return <FaIcons.FaBars className={_style} />;
            case "bell-notification":
                return <FaIcons.FaBell className={_style} />;
            case "view-eye":
                return <FaIcons.FaEye className={_style} />;
            case "bookmark":
                return <BsIcons.BsBookmark className={_style} />;
            case "cartcheck":
                return <BsIcons.BsCartCheck className={_style} />;
            case "filepdf":
                return <BsIcons.BsFileEarmarkPdfFill className={_style} />;
            case "book":
                return <BsIcons.BsBook className={_style} />;
            case "briefcase":
                return <BsIcons.BsBriefcase className={_style} />;
            case "cog":
                return <FaIcons.FaCog className={_style} />;
            case "file":
                return <FaIcons.FaFileAlt className={_style} />;
            case "folder":
                return <FaIcons.FaFolder className={_style} />;
            case "chat":
                return <BsIcons.BsChatRight className={_style} />;
            case "chevron-down":
                return <FaIcons.FaCaretDown className={_style} />;
            case "chevron-right":
                return <HiIcons.HiChevronRight className={_style} />;
            case "chevron-up-down":
                return <HiIcons2.HiChevronUpDown className={_style} />;
            case "circle-filled":
                return <FaIcons.FaCircle className={_style} />;
            case "circle-left-arrow":
                return <HiIcons.HiArrowCircleLeft className={_style} />;
            case "clipboard":
                return <BsIcons.BsClipboard2 className={_style} />;
            case "collection":
                return <HiIcons.HiOutlineCollection className={_style} />;
            case "command":
                return <BsIcons.BsCommand className={_style} />;
            case "complete-icon":
                return <TiIcons.TiTick className={_style} />;
            case "collapse":
                return <VCS.VscCollapseAll className={_style} />;
            case "vmactive":
                return <VCS.VscVmActive className={_style} />;

            case "cross-button":
                return <RxCross2 className={_style} />;
            case "delete":
                return <FiIcons.FiTrash className={_style} />;
            case "delete2":
                return <RiIcons.RiDeleteBinLine className={_style} />;
            case "stockfill":
                return <RiIcons.RiStockFill className={_style} />;
            case "desktop":
                return <FaIcons.FaDesktop className={_style} />;
            case "expand":
                return <VCS.VscExpandAll className={_style} />;
            case "edit":
                return <FiIcons.FiEdit className={_style} />;
            case "edit2":
                return <FaIcons.FaRegEdit className={_style} />;
            case "expand-icon":
                return <FiIcons.FiChevronRight className={_style} />;
            case "star-fav-icon":
                return <RiIcons.RiStarLine className={_style} />;
            case "history":
                return <BiIcons.BiHistory className={_style} />;
            case "homeicon":
                return <FaIcons.FaHome className={_style} />;
            case "image":
                return <BsIcons.BsImages className={_style} />;
            case "link":
                return <HiIcons2.HiOutlineLink className={_style} />;
            case "mic":
                return <BsIcons.BsMic className={_style} />;
            case "moon":
                return <FaIcons.FaMoon className={_style} />;
            case "notebook":
                return <GiIcons.GiNotebook className={_style} />;
            case "outline-office-building":
                return <FaIcons.FaBuilding className={_style} />;
            case "outLineSegment":
                return <MdIcons.MdOutlineSegment className={_style} />;
            case "redeem":
                return <MdIcons.MdRedeem className={_style} />;
            case "refresh":
                return <AiIcons.AiOutlineSync className={_style} />;
            case "open-submenu":
                return <AiIcons.AiOutlineMenuUnfold className={_style} />;

            case "pencil":
                return <HiIcons2.HiOutlinePencilSquare className={_style} />;
            case "plus":
                return <HiIcons2.HiPlus className={_style} />;
            case "right-arrow":
                return <BiIcons.BiSolidRightArrow className={_style} />;
            case "search":
                return <BsIcons.BsSearch className={_style} />;
            case "stack":
                return <HiIcons2.HiOutlineRectangleStack className={_style} />;
            case "stack3d":
                return <HiIcons2.HiOutlineSquare3Stack3D className={_style} />;
            case "sun":
                return <FaIcons.FaSun className={_style} />;
            case "table":
                return <BsIcons.BsTable className={_style} />;
            case "terminal":
                return <BsIcons.BsTerminal className={_style} />;
            case "timeLine":
                return <RiIcons.RiTeamLine className={_style} />;
            case "trash":
                return <HiIcons.HiOutlineTrash className={_style} />;
            case "userfriends":
                return <FaIcons.FaUserFriends className={_style} />;
            case "user-circle":
                return <FaIcons.FaUserCircle className={_style} />;
            case "usergroup":
                return <HiIcons2.HiOutlineUserGroup className={_style} />;
            case "x-mark":
                return <HiIcons2.HiXCircle className={_style} />;
            default:
                return <FaIcons.FaCircle className={_style} />;
        }
    };

    return (
        <div
            className={`${props.divClasses?.length ? props.divClasses.join(" ") : ""
                }`}
            onClick={props.onClick}
        >
            <span>
                {getIcon(props.iconclasses?.length ? props.iconclasses.join(" ") : "")}
            </span>
            {props.text && (
                <span
                    className={`${props.textClasses?.length ? props.textClasses.join(" ") : ""
                        }`}
                >
                    {props.text ? props.text : ""}
                </span>
            )}
        </div>
    );
};

export { RdIcon };

