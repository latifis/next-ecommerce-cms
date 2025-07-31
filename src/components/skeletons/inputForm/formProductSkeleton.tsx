import SkeletonFileUpload from "./master/fileUploadSkeleton";
import SkeletonInput from "./master/inputSkeleton";
import SkeletonSelect from "./master/selectSkeleton";

const FormProductSkeleton = () => {
    return (
        <div className="space-y-4">
            <SkeletonInput type="input" />
            <SkeletonInput type="textarea" />
            <SkeletonInput type="input" />
            <SkeletonInput type="input" />
            <SkeletonInput />
            <SkeletonInput type="input" />
            <SkeletonInput type="input" />
            <SkeletonInput type="input" />
            <SkeletonInput type="input" />
            <SkeletonFileUpload />
            <SkeletonSelect />
            <SkeletonSelect />
        </div>
    );
};

export default FormProductSkeleton;