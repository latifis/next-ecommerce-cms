import SkeletonFileUpload from "./master/fileUploadSkeleton";
import SkeletonInput from "./master/inputSkeleton";

const FormBrandSkeleton = () => {
    return (
        <div className="space-y-4">
            <SkeletonInput type="input" />
            <SkeletonInput type="textarea" />
            <SkeletonFileUpload />
        </div>
    );
};

export default FormBrandSkeleton;