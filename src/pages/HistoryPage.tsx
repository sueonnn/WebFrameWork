import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


/* --- 1. 타입 정의 --- */

interface Meeting { // 모임 데이터 타입
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string;
  status: string;
  statusClasses: string;
}

interface HistoryHeaderProps { // 페이지 헤더 컴포넌트 props
  onGoHome: () => void;
}

interface StatCardProps { // 통계 카드 컴포넌트 props
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClasses: string;
}

interface StatsSectionProps { // 통계 섹션 컴포넌트 props
  meetings: Meeting[];
}

interface FilterControlsProps { // 필터 컨트롤 컴포넌트 props
  uniqueGroups: string[];
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  filteredCount: number;
}

interface MeetingCardProps { // 모임 카드 컴포넌트 props
  meeting: Meeting;
}

interface MeetingListProps { // 모임 리스트 컴포넌트 props
  meetings: Meeting[];
}


/* --- 2. SVG 아이콘 --- */

// 통계 섹션 아이콘
const CalendarIcon = () => (
  <svg width="25" height="25" viewBox="-0.2 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.21006 1.45835V0.729187H0.458557V1.45835M3.21006 1.45835H0.458557M3.21006 1.45835V3.06252H0.458557V1.45835M1.07 0.729187V0.291687M2.59862 0.729187V0.291687" stroke="#6059E8" stroke-width="0.25" stroke-linecap="square"/>
    <path d="M2.36929 1.93231L1.7207 2.55108L1.39648 2.24162" stroke="#6059E8" stroke-width="0.25" stroke-linecap="square"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="27" height="27" viewBox="-0.5 -0.2 4 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.05783 1.47054C1.36249 1.47054 1.62483 1.52311 1.81418 1.64889C2.0103 1.77925 2.11566 1.98012 2.11566 2.24232C2.11396 2.26884 2.10208 2.29372 2.08243 2.31191C2.06277 2.3301 2.03683 2.34022 2.00988 2.34022C1.98293 2.34022 1.95699 2.3301 1.93734 2.31191C1.91769 2.29372 1.9058 2.26884 1.9041 2.24232C1.9041 2.04249 1.82836 1.90941 1.69613 1.8216C1.55692 1.7294 1.34345 1.67913 1.05783 1.67913C0.772218 1.67913 0.558536 1.7294 0.419536 1.82181C0.287307 1.90962 0.211566 2.0427 0.211566 2.24253C0.209864 2.26905 0.197979 2.29393 0.178328 2.31212C0.158677 2.33031 0.132736 2.34043 0.105783 2.34043C0.0788304 2.34043 0.0528899 2.33031 0.0332388 2.31212C0.0135876 2.29393 0.0017021 2.26905 0 2.24253C0 1.98012 0.105149 1.77925 0.301271 1.64889C0.490623 1.52311 0.753177 1.47054 1.05783 1.47054ZM2.11038 1.47054C2.41482 1.47054 2.67737 1.52311 2.86673 1.64889C3.06285 1.77925 3.16821 1.98012 3.16821 2.24253C3.16821 2.27019 3.15706 2.29672 3.13722 2.31627C3.11739 2.33583 3.09048 2.34682 3.06243 2.34682C3.03437 2.34682 3.00746 2.33583 2.98762 2.31627C2.96779 2.29672 2.95664 2.27019 2.95664 2.24253C2.95664 2.0427 2.8809 1.90962 2.74846 1.82181C2.63887 1.74901 2.48337 1.70291 2.28259 1.68622C2.23258 1.60568 2.17053 1.53304 2.09853 1.47075L2.11038 1.47054ZM1.05783 3.0337e-06C1.23167 0.00432211 1.39692 0.0754424 1.51833 0.198192C1.63973 0.320943 1.70768 0.485605 1.70768 0.657054C1.70768 0.828502 1.63973 0.993165 1.51833 1.11591C1.39692 1.23866 1.23167 1.30979 1.05783 1.3141C0.881083 1.3141 0.711573 1.24488 0.586592 1.12166C0.461611 0.998438 0.391398 0.831314 0.391398 0.657054C0.391398 0.482793 0.461611 0.31567 0.586592 0.192449C0.711573 0.0692278 0.881083 3.0337e-06 1.05783 3.0337e-06ZM2.11038 3.0337e-06C2.28713 3.0337e-06 2.45664 0.0692278 2.58162 0.192449C2.7066 0.31567 2.77681 0.482793 2.77681 0.657054C2.77681 0.831314 2.7066 0.998438 2.58162 1.12166C2.45664 1.24488 2.28713 1.3141 2.11038 1.3141C1.99952 1.3141 1.89542 1.28699 1.8036 1.23985C1.84788 1.18496 1.88577 1.12534 1.91658 1.06213C1.98591 1.09447 2.06241 1.10899 2.13896 1.10436C2.21551 1.09973 2.28963 1.07609 2.35443 1.03564C2.41923 0.995184 2.4726 0.939235 2.50959 0.872991C2.54657 0.806746 2.56596 0.732357 2.56596 0.656741C2.56596 0.581124 2.54657 0.506736 2.50959 0.440491C2.4726 0.374246 2.41923 0.318297 2.35443 0.277845C2.28963 0.237393 2.21551 0.213752 2.13896 0.20912C2.06241 0.204488 1.98591 0.219015 1.91658 0.251351C1.88568 0.188272 1.84771 0.128802 1.80339 0.0740516C1.89801 0.0251002 2.00332 -0.000319624 2.11016 3.0337e-06M1.05783 0.208591C0.939595 0.212146 0.827409 0.260954 0.745049 0.344669C0.662689 0.428384 0.616628 0.540427 0.616628 0.657054C0.616628 0.77368 0.662689 0.885723 0.745049 0.969439C0.827409 1.05315 0.939595 1.10196 1.05783 1.10552C1.17847 1.10552 1.29417 1.05827 1.37947 0.974165C1.46478 0.890062 1.5127 0.775993 1.5127 0.657054C1.5127 0.538114 1.46478 0.424045 1.37947 0.339942C1.29417 0.255839 1.17847 0.208591 1.05783 0.208591Z" fill="#38AC5B" />
  </svg>
);
const CalendarCheckIcon = () => (
  <svg width="25" height="23" viewBox="-0.5 -0.3 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.854634 1.61344L1.64742 0.751716L1.48999 0.580594L0.854634 1.27119L0.534146 0.922838L0.376714 1.09396L0.854634 1.61344ZM0 2.20014V0H2.02413V2.20014H0ZM0.224904 1.95568H1.79923V0.24446H0.224904V1.95568Z" fill="#973BEB" />
  </svg>
);
const PercentIcon = () => (
  <svg width="25" height="25" viewBox="-0.2 -0.2 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.1001 1.61347C0.958311 1.61347 0.837303 1.56335 0.737074 1.46312C0.636845 1.36289 0.586731 1.24189 0.586731 1.1001C0.586731 0.958311 0.636845 0.837303 0.737074 0.737074C0.837303 0.636845 0.958311 0.586731 1.1001 0.586731C1.24189 0.586731 1.36289 0.636845 1.46312 0.737074C1.56335 0.837303 1.61347 0.958311 1.61347 1.1001C1.61347 1.24189 1.56335 1.36289 1.46312 1.46312C1.36289 1.56335 1.24189 1.61347 1.1001 1.61347ZM1.1001 1.32011C1.16121 1.32011 1.21319 1.29875 1.25601 1.25601C1.29884 1.21328 1.32021 1.16131 1.32011 1.1001C1.32001 1.03889 1.29865 0.986962 1.25601 0.944328C1.21338 0.901694 1.16141 0.880279 1.1001 0.880084C1.03879 0.879888 0.986864 0.901303 0.944328 0.944328C0.901792 0.987353 0.880377 1.03928 0.880084 1.1001C0.87979 1.16092 0.901205 1.21289 0.944328 1.25601C0.987451 1.29914 1.03937 1.3205 1.1001 1.32011ZM2.42018 2.93355C2.2784 2.93355 2.15739 2.88344 2.05716 2.78321C1.95693 2.68298 1.90682 2.56197 1.90682 2.42018C1.90682 2.2784 1.95693 2.15739 2.05716 2.05716C2.15739 1.95693 2.2784 1.90682 2.42018 1.90682C2.56197 1.90682 2.68298 1.95693 2.78321 2.05716C2.88344 2.15739 2.93355 2.2784 2.93355 2.42018C2.93355 2.56197 2.88344 2.68298 2.78321 2.78321C2.68298 2.88344 2.56197 2.93355 2.42018 2.93355ZM2.42018 2.6402C2.4813 2.6402 2.53327 2.61883 2.5761 2.5761C2.61893 2.53337 2.6403 2.4814 2.6402 2.42018C2.6401 2.35897 2.61874 2.30705 2.5761 2.26441C2.53347 2.22178 2.4815 2.20037 2.42018 2.20017C2.35887 2.19997 2.30695 2.22139 2.26441 2.26441C2.22188 2.30744 2.20046 2.35936 2.20017 2.42018C2.19988 2.48101 2.22129 2.53298 2.26441 2.5761C2.30754 2.61922 2.35946 2.64059 2.42018 2.6402ZM0.689404 2.83088C0.662514 2.80399 0.649068 2.76976 0.649068 2.72821C0.649068 2.68665 0.662514 2.65242 0.689404 2.62553L2.62553 0.689404C2.65242 0.662514 2.68665 0.649068 2.7282 0.649068C2.76976 0.649068 2.80399 0.662514 2.83088 0.689404C2.85777 0.716295 2.87121 0.75052 2.87121 0.792078C2.87121 0.833636 2.85777 0.867861 2.83088 0.894751L0.894751 2.83088C0.867861 2.85777 0.833636 2.87121 0.792078 2.87121C0.75052 2.87121 0.716295 2.85777 0.689404 2.83088Z" fill="#EB5910" />
  </svg>
);

// 모임 카드 아이콘
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.90935 0.811848V0.351326H0.0750122V0.811848M1.90935 0.811848H0.0750122M1.90935 0.811848V1.825H0.0750122V0.811848M0.482643 0.351326V0.0750122M1.50172 0.351326V0.0750122" stroke="#373737" stroke-width="0.15" stroke-linecap="square" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="-0.7 -0.4 2 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.73049 0.896275C1.73049 1.54327 0.915234 2.09072 0.915234 2.09072C0.915234 2.09072 0.0999756 1.54327 0.0999756 0.896275C0.0999756 0.685083 0.185869 0.482541 0.338759 0.333206C0.49165 0.183871 0.699014 0.0999756 0.915234 0.0999756C1.13145 0.0999756 1.33882 0.183871 1.49171 0.333206C1.6446 0.482541 1.73049 0.685083 1.73049 0.896275Z" stroke="#373737" stroke-width="0.2" />
    <path d="M1.22094 0.896268C1.22094 0.975465 1.18873 1.05142 1.1314 1.10742C1.07406 1.16342 0.996302 1.19488 0.915219 1.19488C0.834137 1.19488 0.756375 1.16342 0.699041 1.10742C0.641707 1.05142 0.609497 0.975465 0.609497 0.896268C0.609497 0.817071 0.641707 0.741118 0.699041 0.685118C0.756375 0.629117 0.834137 0.597656 0.915219 0.597656C0.996302 0.597656 1.07406 0.629117 1.1314 0.685118C1.18873 0.741118 1.22094 0.817071 1.22094 0.896268Z" stroke="#373737" stroke-width="0.2" />
  </svg>
);
const SmallUsersIcon = () => (
  <svg width="22" height="22" viewBox="-0.5 -0.4 4 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.02078 1.46209C1.31476 1.46209 1.56791 1.51436 1.75063 1.63941C1.93989 1.76903 2.04155 1.96874 2.04155 2.22943C2.03991 2.2558 2.02844 2.28054 2.00948 2.29862C1.99052 2.31671 1.96549 2.32677 1.93948 2.32677C1.91347 2.32677 1.88844 2.31671 1.86947 2.29862C1.85051 2.28054 1.83904 2.2558 1.8374 2.22943C1.8374 2.03075 1.76431 1.89844 1.63671 1.81113C1.50238 1.71946 1.29639 1.66948 1.02078 1.66948C0.745168 1.66948 0.538971 1.71946 0.40484 1.81134C0.277243 1.89865 0.204156 2.03096 0.204156 2.22964C0.202513 2.25601 0.191044 2.28075 0.172081 2.29883C0.153118 2.31691 0.128086 2.32698 0.102078 2.32698C0.076069 2.32698 0.0510372 2.31691 0.0320744 2.29883C0.0131117 2.28075 0.00164247 2.25601 0 2.22964C0 1.96874 0.101465 1.76903 0.290717 1.63941C0.473437 1.51436 0.726794 1.46209 1.02078 1.46209ZM2.03645 1.46209C2.33023 1.46209 2.58359 1.51436 2.76631 1.63941C2.95556 1.76903 3.05723 1.96874 3.05723 2.22964C3.05723 2.25714 3.04647 2.28352 3.02733 2.30296C3.00819 2.32241 2.98222 2.33333 2.95515 2.33333C2.92808 2.33333 2.90211 2.32241 2.88297 2.30296C2.86383 2.28352 2.85307 2.25714 2.85307 2.22964C2.85307 2.03096 2.77999 1.89865 2.65218 1.81134C2.54643 1.73896 2.39638 1.69312 2.20263 1.67653C2.15437 1.59645 2.0945 1.52423 2.02502 1.4623L2.03645 1.46209ZM1.02078 3.01627e-06C1.18853 0.00429727 1.34799 0.0750088 1.46514 0.197053C1.5823 0.319098 1.64787 0.482814 1.64787 0.653277C1.64787 0.823741 1.5823 0.987457 1.46514 1.1095C1.34799 1.23155 1.18853 1.30226 1.02078 1.30655C0.850219 1.30655 0.686647 1.23772 0.566044 1.11521C0.445442 0.992699 0.377688 0.826537 0.377688 0.653277C0.377688 0.480018 0.445442 0.313855 0.566044 0.191343C0.686647 0.0688299 0.850219 3.01627e-06 1.02078 3.01627e-06ZM2.03645 3.01627e-06C2.20701 3.01627e-06 2.37058 0.0688299 2.49118 0.191343C2.61179 0.313855 2.67954 0.480018 2.67954 0.653277C2.67954 0.826537 2.61179 0.992699 2.49118 1.11521C2.37058 1.23772 2.20701 1.30655 2.03645 1.30655C1.92947 1.30655 1.82903 1.27959 1.74043 1.23272C1.78315 1.17815 1.81972 1.11888 1.84944 1.05603C1.91635 1.08818 1.99016 1.10262 2.06403 1.09801C2.13791 1.09341 2.20943 1.0699 2.27196 1.02968C2.33449 0.989465 2.38599 0.933837 2.42168 0.867973C2.45737 0.802109 2.47608 0.728148 2.47608 0.652966C2.47608 0.577784 2.45737 0.503823 2.42168 0.437959C2.38599 0.372095 2.33449 0.316468 2.27196 0.276248C2.20943 0.236029 2.13791 0.212524 2.06403 0.207918C1.99016 0.203313 1.91635 0.217756 1.84944 0.249906C1.81963 0.18719 1.78299 0.128062 1.74022 0.073626C1.83152 0.024956 1.93314 -0.000317787 2.03625 3.01627e-06M1.02078 0.207392C0.906682 0.210927 0.798426 0.259454 0.71895 0.342688C0.639475 0.425922 0.595028 0.537321 0.595028 0.653277C0.595028 0.769234 0.639475 0.880633 0.71895 0.963867C0.798426 1.0471 0.906682 1.09563 1.02078 1.09916C1.13719 1.09916 1.24883 1.05219 1.33115 0.968566C1.41347 0.884946 1.45971 0.771534 1.45971 0.653277C1.45971 0.535021 1.41347 0.421608 1.33115 0.337989C1.24883 0.254369 1.13719 0.207392 1.02078 0.207392Z" fill="#373737" />
  </svg>
);

// 기타 아이콘
const HomeIcon = () => (
  <svg width="17" height="17" viewBox="-0.2 -0.1 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.45565 2.44407C2.45565 2.48062 2.44127 2.51568 2.41569 2.54152C2.3901 2.56737 2.3554 2.58189 2.31922 2.58189H0.136425C0.100243 2.58189 0.0655425 2.56737 0.0399579 2.54152C0.0143733 2.51568 3.28389e-08 2.48062 3.28389e-08 2.44407V0.995574C-1.43906e-05 0.974572 0.00472264 0.953845 0.0138493 0.934974C0.022976 0.916104 0.0362508 0.899591 0.05266 0.886696L1.14406 0.029038C1.16801 0.0102179 1.19748 0 1.22782 0C1.25816 0 1.28764 0.0102179 1.31159 0.029038L2.40299 0.886696C2.41939 0.899591 2.43267 0.916104 2.4418 0.934974C2.45092 0.953845 2.45566 0.974572 2.45565 0.995574V2.44407ZM2.1828 2.30625V1.06283L1.22782 0.312535L0.27285 1.06283V2.30625H2.1828Z" fill="#6059E8" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="25" height="20" viewBox="0 -0.2 4 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.4303 1.08622L0.713559 0.481237L0.892712 0.330017L1.51988 0.859392L2.14704 0.330017L2.32619 0.481237L1.60945 1.08622C1.58569 1.10627 1.55347 1.11753 1.51988 1.11753C1.48628 1.11753 1.45406 1.10627 1.4303 1.08622Z" fill="#373737" />
  </svg>
);
const CheckIcon = () => (
  <svg width="25" height="20" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5833 0.942071C2.61031 0.967477 2.62744 1.00418 2.63092 1.0441C2.6344 1.08403 2.62394 1.12391 2.60186 1.15497L1.41765 2.81945C1.40601 2.83581 1.39152 2.84918 1.37511 2.85871C1.3587 2.86824 1.34074 2.8737 1.32238 2.87476C1.30402 2.87581 1.28567 2.87243 1.26851 2.86484C1.25136 2.85724 1.23578 2.84559 1.22278 2.83064L0.564889 2.07406C0.552322 2.06011 0.542298 2.04341 0.535402 2.02495C0.528506 2.00649 0.524876 1.98663 0.524724 1.96654C0.524572 1.94645 0.527902 1.92652 0.534517 1.90793C0.541133 1.88933 0.550903 1.87244 0.563258 1.85823C0.575612 1.84402 0.590303 1.83279 0.606474 1.82518C0.622644 1.81757 0.63997 1.81374 0.657441 1.81391C0.674912 1.81409 0.692178 1.81826 0.708231 1.82619C0.724284 1.83412 0.738803 1.84565 0.750941 1.8601L1.30607 2.4985L2.39817 0.963406C2.42027 0.932349 2.45218 0.912654 2.4869 0.908653C2.52161 0.904652 2.55629 0.916672 2.5833 0.942071Z" fill="white" />
  </svg>
);


/* --- 3. 더미 데이터(추후 실제 데이터 연동으로 변경) --- */
const DUMMY_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: '프로젝트 팀',
    date: '2024년 1월 15일',
    time: '목요일 18:00-20:00',
    location: '강남역 2번 출구 스타벅스',
    participants: '6명 참석',
    status: '100% 완료',
    statusClasses: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    title: '독서 모임',
    date: '2024년 1월 8일',
    time: '토요일 14:00-16:00',
    location: "홍대 북카페 '책과 커피'",
    participants: '4명 참석',
    status: '87% 완료',
    statusClasses: 'bg-pink-100 text-red-700',
  },
  {
    id: 3,
    title: '운동 모임',
    date: '2024년 1월 1일',
    time: '월요일 10:00-12:00',
    location: '한강공원 뚝섬유원지',
    participants: '3명 참석',
    status: '100% 완료',
    statusClasses: 'bg-green-100 text-green-700',
  },
];

/* --- 4. 메인 페이지 컴포넌트 --- */
export default function HistoryPage() {
  const navigate = useNavigate();

  // (1) 선택된 그룹을 관리하는 state ('전체'를 기본값으로 설정)
  const [selectedGroup, setSelectedGroup] = useState('전체');

  const handleGoHome = () => {
    navigate('/');
  };

  // (2) 전체 미팅 목록에서 고유한 그룹 이름 목록 추출 (Set 사용)
  const uniqueGroups = [
    '전체',
    ...new Set(DUMMY_MEETINGS.map((meeting) => meeting.title)),
  ];

  // (3) 선택된 그룹에 따라 미팅 목록 필터링
  const filteredMeetings = DUMMY_MEETINGS.filter((meeting) => {
    if (selectedGroup === '전체') {
      return true; // '전체'면 모든 모임 반환
    }
    return meeting.title === selectedGroup; // 선택된 그룹과 일치하는 모임만 반환
  });

  return (
    <section className="bg-gray-50 py-12 min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
        <HistoryHeader onGoHome={handleGoHome} />

        {/* (4) StatsSection에 필터링된 데이터 전달 */}
        <StatsSection meetings={filteredMeetings} />

        {/* (5) FilterControls에 필요한 props 모두 전달 */}
        <FilterControls
          uniqueGroups={uniqueGroups}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup} // state 변경 함수 전달
          filteredCount={filteredMeetings.length} // 필터링된 개수 전달
        />

        {/* (6) MeetingList에 필터링된 데이터 전달 */}
        <MeetingList meetings={filteredMeetings} />
      </div>
    </section>
  );
}


/* --- 5. 자식 컴포넌트 --- */

// 5-1. 페이지 헤더
const HistoryHeader: React.FC<HistoryHeaderProps> = ({ onGoHome }) => (
  <div className="flex w-full items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">우리의 추억 보관함</h1>
      <p className="mt-2 text-md text-gray-500">함께한 소중한 시간들을 돌아보세요</p>
    </div>
    <button
      onClick={onGoHome}
      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 shadow-sm"
    >
      <HomeIcon /> 홈으로
    </button>
  </div>
);

// 5-2. 통계 카드 (StatsSection의 자식)
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClasses }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colorClasses}`}
    >
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

// 5-3. 통계 섹션
const StatsSection: React.FC<StatsSectionProps> = ({ meetings }) => {
  const totalMeetings = meetings.length;

  const completedMeetings = meetings.filter(
    (m) => m.status === '100% 완료'
  ).length;

  const completionRate =
    totalMeetings > 0
      ? Math.round((completedMeetings / totalMeetings) * 100)
      : 0;

  // 임시로 '6'으로 설정, 추후 멤버 수 받아 계산하도록 수정할 예정.
  const totalUniqueMembers = 6;

  const stats = [
    {
      id: 1,
      label: '총 모임',
      value: `${totalMeetings}`,
      icon: <CalendarIcon />,
      colorClasses: 'bg-violet-100 text-violet-600',
    },
    {
      id: 2,
      label: '참여 멤버',
      value: `${totalUniqueMembers}`,
      icon: <UsersIcon />,
      colorClasses: 'bg-lime-100 text-lime-600',
    },
    {
      id: 3,
      label: '완료된 모임',
      value: `${completedMeetings}`,
      icon: <CalendarCheckIcon />,
      colorClasses: 'bg-violet-100 text-violet-600',
    },
    {
      id: 4,
      label: '완료율',
      value: `${completionRate}%`,
      icon: <PercentIcon />,
      colorClasses: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          colorClasses={stat.colorClasses}
        />
      ))}
    </div>
  );
};

// 5-4. 필터 컨트롤
const FilterControls: React.FC<FilterControlsProps> = ({
  uniqueGroups,
  selectedGroup,
  onGroupChange,
  filteredCount,
}) => {
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsGroupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleGroupSelect = (group: string) => {
    onGroupChange(group); // 부모 컴포넌트에 변경 알림
    setIsGroupOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* --- 그룹 필터 (드롭다운) --- */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">그룹:</span>
            <button
              onClick={() => setIsGroupOpen(!isGroupOpen)}
              className="flex w-36 items-center justify-between gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span>{selectedGroup}</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* 드롭다운 메뉴 */}
          {isGroupOpen && (
            <div className="absolute z-10 mt-2 w-full rounded-lg bg-gray-800 p-2 shadow-lg">
              {uniqueGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupSelect(group)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
                    selectedGroup === group
                      ? 'text-white' // 선택된 항목
                      : 'text-gray-300' // 미선택 항목
                  } hover:bg-indigo-500 hover:text-white`}
                >
                  <div className="w-5">
                    {selectedGroup === group && <CheckIcon />}
                  </div>
                  <span>{group}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- 정렬 필터 --- */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <button className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            최신순 <ChevronDownIcon />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        총 {filteredCount}개의 모임 기록
      </div>
    </div>
  );
};

// 5-5. 모임 카드 (MeetingList의 자식)
const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => (
  <li className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
    {/* 카드 상단: 아이콘, 제목, 날짜, 상태, 드롭다운 버튼 */}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <CalendarIcon />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{meeting.title}</h3>
          <p className="text-sm text-gray-500">{meeting.date}</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-4 pl-16 sm:pl-0">
        <span
          className={`mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-semibold ${meeting.statusClasses}`}
        >
          {meeting.status}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <ChevronDownIcon />
        </button>
      </div>
    </div>
    
    {/* 카드 하단: 시간, 장소, 인원 정보 */}
    <div className="mt-5 flex flex-wrap items-center justify-between pl-16">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <ClockIcon />
        <span>{meeting.time}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <MapPinIcon />
        <span>{meeting.location}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <SmallUsersIcon />
        <span>{meeting.participants}</span>
      </div>
    </div>
  </li>
);

// 5-6. 모임 리스트
const MeetingList: React.FC<MeetingListProps> = ({ meetings }) => (
  <ul className="mt-6 w-full space-y-4">
    {meetings.map((meeting) => (
      <MeetingCard key={meeting.id} meeting={meeting} />
    ))}
  </ul>
);