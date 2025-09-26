import SkeletonFileUpload from "./master/fileUploadSkeleton";
import SkeletonInput from "./master/inputSkeleton";

const FormPaymentSkeleton = () => {
    return (
        <div className="space-y-4">
            <SkeletonInput type="input" />
            <SkeletonInput type="textarea" />
            <SkeletonInput type="input" />
            <SkeletonInput type="input" />
            <SkeletonFileUpload />
        </div>
    );
};

export default FormPaymentSkeleton;