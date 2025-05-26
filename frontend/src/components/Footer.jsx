import React from 'react';

const Footer = () => {
	return (
		<footer className="bg-gray-800 py-5 mt-auto">
			<div className="max-w-screen-xl mx-auto text-center">
				<p className="text-white text-sm">
					© {new Date().getFullYear()} Inventrack. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
