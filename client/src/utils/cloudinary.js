const CLOUD_NAME='dcujap7df';
const UPLOAD_PRESET='efdbrqh3';
// const API_KEY='353846769714977';
// const API_SECRET='KpsPs366aMFBS5UYhl-0bjJCINs';

export const uploadFile = async (file, folderName) => {
    const data = new FormData();
    if(folderName === 'nfts') {
        const metadata = new Blob([file], { type: 'application/json' });
        data.append("file", metadata, 'metadata.json');
    }else {
        data.append("file", file);
    }

    data.append( "upload_preset", UPLOAD_PRESET );
    
    data.append("cloud_name", CLOUD_NAME);
    data.append("folder", folderName);

    try {
        const response = await fetch(
            folderName === 'nfts' ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload` : 
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );
        const res = await response.json();
        return res.secure_url;
    } catch (error) {
        console.log(error);
    }
}

