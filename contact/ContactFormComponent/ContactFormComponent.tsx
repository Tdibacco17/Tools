import Image from "next/image";
import styles from "./ContactFormComponent.module.scss";
import data from "@/models/es.json";
import React from "react";
import FieldToCompleteComponent from "../FieldToCompleteComponent/FieldToCompleteComponent";
import SelectToCompleteComponent from "../SelectToCompleteComponent/SelectToCompleteComponent";
import { ContactProps } from "@/types";
import NotifyComponent from "../NotifyComponent/NotifyComponent";


export default function ContactFormComponent({
    handleSubmit,
    formValues,
    radioValues,
    handleChange,
    errors,
    btnSubmitClicked,
    isContactPage,
    openContact,
    notification
}: ContactProps) {
    return (
        <>
            <div className={`${styles["container-section-contact-form"]}
            ${isContactPage && styles["container-contactPage"]}`}>
                <form onSubmit={handleSubmit} className={`${styles["form"]} ${isContactPage && styles["form-contactPage"]} ${openContact && styles["active"]}`}>
                    <div className={`${styles["form-title"]} ${isContactPage && styles["hidden-isContactPage"]}`}>
                        <div className={styles["form-outer-icon"]}>
                            <Image
                                src={data.contact.title.svgSrc}
                                alt="Icono Formulario"
                                width={27.5}
                                height={27.5}
                                className={styles["form-inner-icon"]}
                            />
                        </div>
                        <span className={styles["text"]}>{data.contact.title.text}</span>
                    </div>
                    <div className={`${styles["container-information"]} ${isContactPage && styles["container-information-contactPage"]}`}>
                        <FieldToCompleteComponent textArea={false} isContactPage={isContactPage}
                            inputFieldsData={data.contact.fields.labels.Nombre} handleChange={handleChange}
                            errors={errors} formValues={formValues.name} btnSubmitClicked={btnSubmitClicked}
                            valueType="name" />
                        <FieldToCompleteComponent textArea={false} isContactPage={isContactPage}
                            inputFieldsData={data.contact.fields.labels.Apellido} handleChange={handleChange}
                            errors={errors} formValues={formValues.lastname} btnSubmitClicked={btnSubmitClicked}
                            valueType="lastname" />
                        <FieldToCompleteComponent textArea={false} isContactPage={isContactPage}
                            inputFieldsData={data.contact.fields.labels.Telefono} handleChange={handleChange}
                            errors={errors} formValues={formValues.phone} btnSubmitClicked={btnSubmitClicked}
                            valueType="phone" />
                        <FieldToCompleteComponent textArea={false} isContactPage={isContactPage}
                            inputFieldsData={data.contact.fields.labels.Email} handleChange={handleChange}
                            errors={errors} formValues={formValues.email} btnSubmitClicked={btnSubmitClicked}
                            valueType="mail" />
                        <SelectToCompleteComponent isFilter={false} radioValues={radioValues} isContactPage={isContactPage}
                            btnSubmitClicked={btnSubmitClicked} errors={errors} handleChange={handleChange} />
                        <FieldToCompleteComponent textArea={true} isContactPage={isContactPage}
                            inputFieldsData={data.contact.fields.labels.textArea} handleChange={handleChange}
                            errors={errors} formValues={formValues.consultation} btnSubmitClicked={btnSubmitClicked}
                            valueType="consultation" />
                    </div>
                    <div className={styles["container-form-button"]}>
                        <button
                            disabled={btnSubmitClicked}
                            className={`${styles["form-button"]} ${isContactPage && styles["btn-contactPage"]} ${btnSubmitClicked ? styles["disabled"] : ""}`}
                            type="submit">
                            {btnSubmitClicked ? "Cargando..." : data.contact.sendButton}
                        </button>
                    </div>
                </form>
            </div>
            <NotifyComponent notification={notification} />
        </>
    );
}
