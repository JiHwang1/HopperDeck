"use client";

import React from "react";
import styles from "./UserCard.module.css";

interface UserCardProps {
	name: string;
	author: string;
	description: string;
	downloads?: string;
	version?: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, author, description, downloads = "1.2k", version = "v1.0.0" }) => {
	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.iconPlaceholder}>{name[0].toUpperCase()}</div>
				<div className={styles.titleInfo}>
					<h3 className={styles.name}>{name}</h3>
					<p className={styles.author}>by {author}</p>
				</div>
				<div className={styles.badge}>{version}</div>
			</div>
			<p className={styles.description}>{description}</p>
			<div className={styles.footer}>
				<span className={styles.downloads}>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
					{downloads}
				</span>
				<button className={styles.installBtn}>Install</button>
			</div>
		</div>
	);
};

export default UserCard;
